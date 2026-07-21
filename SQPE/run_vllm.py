"""
Offline batched-inference vLLM worker on Modal — H100 only.

No HTTP server, no subprocess — vLLM's LLM() object lives in-process inside
the Modal container, and .generate() is called directly. This avoids HTTP
overhead and gives direct access to per-request RequestMetrics
(arrival, scheduled, first-token, finished timestamps) needed for the
prefill/decode/prefix-cache analysis.

GPU type is fixed at container-class definition time in Modal, so this file
defines the H100 worker. Quantization IS a runtime parameter, so this one
class serves both FP8 and BF16 — Modal spins up a distinct container per
unique parameter combination.

Deploy with: modal deploy run_vllm.py
"""

import time

import modal

app = modal.App("sem-engine-vllm-test")

vllm_image = (
    modal.Image.from_registry("nvidia/cuda:12.8.0-devel-ubuntu22.04", add_python="3.12")
    .entrypoint([])
    .uv_pip_install(
        "vllm>=0.16.1",           # first line with qwen3_5 support integrated
        "transformers>=5.2.0",    # required for the qwen3_5 architecture
        "huggingface_hub[hf_transfer]",
    )
    .env({"HF_HUB_ENABLE_HF_TRANSFER": "1"})
)

hf_cache_vol = modal.Volume.from_name("huggingface-cache", create_if_missing=True)
vllm_cache_vol = modal.Volume.from_name("vllm-cache", create_if_missing=True)

MODEL_NAME = "Qwen/Qwen3.5-4B"
MODEL_REVISION = "851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a"  # verify latest commit hash on the HF repo right before deploying

# ---------------------------------------------------------------------------
# CONSTANTS — only what was explicitly specified; everything else uses
# vLLM's own built-in defaults (left unset below).
# ---------------------------------------------------------------------------
TENSOR_PARALLEL_SIZE = 1                  # per spec: TP=1
MAX_NUM_BATCHED_TOKENS = 8192             # per spec: mnbt=8192
MAX_NUM_SEQS = 1024                       # per spec: "very high"
DISABLE_LOG_STATS = False                 # required for get_metrics()/Prometheus data to populate

# Metric names we snapshot before/after every generate() call.
# See https://docs.vllm.ai/en/stable/usage/metrics/
# NOTE: num_requests_running and kv_cache_usage_perc are point-in-time gauges —
# a single blocking .generate() call drains fully before returning, so these
# will read ~0 both before and after. They're included for completeness but
# won't show peak concurrency without continuous polling during the call.
VLLM_METRIC_NAMES = (
    "vllm:num_requests_running",
    "vllm:kv_cache_usage_perc",
    "vllm:prefix_cache_queries",
    "vllm:prefix_cache_hits",
    "vllm:prompt_tokens_total",
    "vllm:generation_tokens_total",
    "vllm:request_success_total",
    "vllm:request_prompt_tokens",
    "vllm:request_generation_tokens",
    "vllm:time_to_first_token_seconds",
    "vllm:inter_token_latency_seconds",
    "vllm:e2e_request_latency_seconds",
    "vllm:request_prefill_time_seconds",
    "vllm:request_decode_time_seconds",
)


def snapshot_vllm_metrics(llm) -> dict:
    """
    Normalizes vLLM's typed metric objects (Counter/Gauge/Vector/Histogram
    from vllm.v1.metrics.reader) into {sample_name: [{labels, value}]},
    mirroring Prometheus sample naming (_count/_sum/_bucket for histograms)
    so diff_metrics works unchanged.
    """
    from vllm.v1.metrics.reader import Counter, Gauge, Histogram, Vector

    snapshot = {}

    def add(sample_name, labels, value):
        snapshot.setdefault(sample_name, []).append({
            "labels": dict(labels),
            "value": value,
        })

    for metric in llm.get_metrics():
        if isinstance(metric, (Counter, Gauge)):
            add(metric.name, metric.labels, metric.value)
        elif isinstance(metric, Vector):
            for i, v in enumerate(metric.values):
                add(metric.name, {**metric.labels, "index": str(i)}, v)
        elif isinstance(metric, Histogram):
            add(f"{metric.name}_count", metric.labels, metric.count)
            add(f"{metric.name}_sum", metric.labels, metric.sum)
            for le, count in metric.buckets.items():
                add(f"{metric.name}_bucket", {**metric.labels, "le": str(le)}, count)
    return snapshot


def diff_metrics(before: dict, after: dict) -> dict:
    """
    Computes per-metric deltas between two snapshots.
    - Counters and histogram _bucket/_sum/_count: subtract before from after.
    - Gauges (num_requests_running, kv_cache_usage_perc): keep the 'after'
      value as-is — see the caveat above about what this actually captures
      for a single blocking generate() call.
    """
    gauges = {"vllm:num_requests_running", "vllm:kv_cache_usage_perc"}
    result = {}
    for name, after_samples in after.items():
        before_samples = {tuple(sorted(s["labels"].items())): s["value"] for s in before.get(name, [])}
        entries = []
        for s in after_samples:
            key = tuple(sorted(s["labels"].items()))
            before_val = before_samples.get(key, 0)
            if name in gauges:
                entries.append({"labels": s["labels"], "value": s["value"]})
            else:
                entries.append({"labels": s["labels"], "delta": s["value"] - before_val})
        result[name] = entries
    return result


def _get_ts(m, *names):
    """Return the first present, non-None attribute among candidate names."""
    for n in names:
        v = getattr(m, n, None)
        if v is not None:
            return v
    return None

@app.cls(
    image=vllm_image,
    gpu="H100",
    timeout=3600,
    volumes={
        "/root/.cache/huggingface": hf_cache_vol,
        "/root/.cache/vllm": vllm_cache_vol,
    },
)

class WorkerH100:
    quantization: str = modal.parameter(default="fp8")  # "fp8" or "bf16"
    enable_prefix_caching: bool = modal.parameter(default=True)

    @modal.enter()
    def load(self):
        from vllm import LLM

        kwargs = dict(
            model=MODEL_NAME,
            revision=MODEL_REVISION,
            tensor_parallel_size=TENSOR_PARALLEL_SIZE,
            max_num_batched_tokens=MAX_NUM_BATCHED_TOKENS,
            max_num_seqs=MAX_NUM_SEQS,
            disable_log_stats=DISABLE_LOG_STATS,
            enable_prefix_caching=self.enable_prefix_caching,
        )
        if self.quantization == "fp8":
            kwargs["quantization"] = "fp8"
        # bf16 = vLLM default dtype for an unquantized checkpoint, no flag needed
        # everything else (gpu_memory_utilization, enforce_eager, dtype,
        # swap_space, block_size, ...) is left unset -> vLLM's own defaults

        print(f"Loading {MODEL_NAME} | gpu=H100 | quant={self.quantization} "
              f"| prefix_caching={self.enable_prefix_caching}")
        self.llm = LLM(**kwargs)

    @modal.method()
    def generate_batch(self, prompts: list[str], max_tokens: int | None) -> dict:
        from vllm import SamplingParams

        sp = SamplingParams(temperature = 0, max_tokens = max_tokens)
        conversations = [[{"role": "user", "content": p}] for p in prompts]

        metrics_before = snapshot_vllm_metrics(self.llm)
        t0 = time.perf_counter()
        outputs = self.llm.chat(
            conversations,
            sp,
            chat_template_kwargs = {"enable_thinking": False},
        )
        t1 = time.perf_counter()
        metrics_after = snapshot_vllm_metrics(self.llm)
        vllm_metrics_delta = diff_metrics(metrics_before, metrics_after)

        per_request = []
        printed_fields = False
        for o in outputs:
            m = o.metrics
            if m is not None and not printed_fields:
                # one-time debug: show what this vLLM version actually exposes
                print("request metrics fields:",
                      [a for a in dir(m) if not a.startswith("_")])
                printed_fields = True

            arrival = _get_ts(m, "arrival_time", "arrival_ts") if m else None
            scheduled = _get_ts(m, "first_scheduled_time", "scheduled_time",
                                "scheduled_ts", "queued_ts") if m else None
            first_tok = _get_ts(m, "first_token_time", "first_token_ts") if m else None
            finished = _get_ts(m, "finished_time", "finished_ts",
                               "last_token_time", "last_token_ts") if m else None

            per_request.append({
                "prompt_tokens": len(o.prompt_token_ids),
                "output_tokens": len(o.outputs[0].token_ids),
                "text": o.outputs[0].text,
                "arrival_time": arrival,
                "first_scheduled_time": scheduled,
                "first_token_time": first_tok,
                "finished_time": finished,
                "time_in_queue": (scheduled - arrival) if scheduled and arrival else None,
                "ttft": (first_tok - arrival) if first_tok and arrival else None,
                "e2e_latency": (finished - arrival) if finished and arrival else None,
            })

        return {
            "wall_time_s": t1 - t0,
            "n_prompts": len(prompts),
            "gpu": "H100",
            "quantization": self.quantization,
            "per_request": per_request,
            "vllm_metrics": vllm_metrics_delta,   # the 13 Prometheus metrics, per this batch
        }