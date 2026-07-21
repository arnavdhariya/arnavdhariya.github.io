"""
Real AI-SQL query benchmark (H100 only this round) — DocETL-style operators.

Pipeline per run:
  1. Load reviews/movies data from Kaggle
  2. Run the relational CTE in DuckDB -> reviews_pool
  3. Translate each AI-SQL query into a DocETL-style operator plan
     (Filter / Reduce with JSON structured output)
  4. Submit each operator's prompts as ONE batch to the deployed Modal worker
  5. Log per-request timing + vLLM Prometheus metrics per operator call

Prompt conventions follow DocETL (ucbepic/docetl), rendered with plain Python:
  - filter decisions come from a boolean field in a JSON structured output,
    not free-text YES/NO
  - reduce concatenates the group's documents into one prompt, grouped by
    reduce_key, result from a JSON "summary" field
  - a pipeline-level system prompt is built from dataset_description + persona
Execution stays on our own offline vLLM worker (no DocETL runtime, no LiteLLM).

Run this AFTER `modal deploy run_vllm.py`.
Requires: pip install kagglehub[pandas-datasets] duckdb modal pandas
"""

import json
import time

import duckdb
import kagglehub
from kagglehub import KaggleDatasetAdapter
import modal
import pandas as pd

# ---------------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------------

APP_NAME = "sem-engine-vllm-test"
MODEL_NAME = "Qwen/Qwen3.5-4B"

GRID = [
    ("H100", "fp8"),
    ("H100", "bf16"),
]

N_SWEEP = [100, 500, 1000]    # movie_pool size (N) — the actual variable of interest

# CTE parameters
S = 0
REVIEWS_PER_MOVIE = None      # None = include ALL reviews per movie (no rn cap).

OUTPUT_LOG_PATH = "benchmark_results.json"

# DocETL-style pipeline-level system prompt (dataset_description + persona)
DATASET_DESCRIPTION = "a collection of Rotten Tomatoes movie reviews with movie metadata"
PERSONA = "a film critic analyzing audience and critic reactions to movies"
SYSTEM_PROMPT = f"You are {PERSONA}. You are working with {DATASET_DESCRIPTION}."


# ---------------------------------------------------------------------------
# STEP 0 — LOAD DATA FROM KAGGLE
# ---------------------------------------------------------------------------

print("Loading reviews and movies datasets from Kaggle...")

df = kagglehub.load_dataset(
    KaggleDatasetAdapter.PANDAS,
    "andrezaza/clapper-massive-rotten-tomatoes-movies-and-reviews",
    "rotten_tomatoes_movie_reviews.csv",
)
df_2 = kagglehub.load_dataset(
    KaggleDatasetAdapter.PANDAS,
    "andrezaza/clapper-massive-rotten-tomatoes-movies-and-reviews",
    "rotten_tomatoes_movies.csv",
)

print(f"Loaded {len(df):,} reviews and {len(df_2):,} movies")
print("reviews columns:", list(df.columns))
print("movies columns:", list(df_2.columns))


# ---------------------------------------------------------------------------
# STEP 1 — CONNECT VIA DUCKDB
# ---------------------------------------------------------------------------

con = duckdb.connect()
con.register("reviews", df)
con.register("movies", df_2)

CTE_SQL_CAPPED = """
WITH movie_pool AS (
  SELECT id FROM movies ORDER BY id LIMIT ? OFFSET ?
),
reviews_pool AS (
  SELECT r.*, m.title, m.genre, m.director,
         ROW_NUMBER() OVER (PARTITION BY r.id ORDER BY r.reviewId) AS rn
  FROM reviews r
  JOIN movie_pool p ON r.id = p.id
  JOIN movies m ON r.id = m.id
)
SELECT * EXCLUDE (rn) FROM reviews_pool
WHERE rn <= ?
"""

CTE_SQL_UNCAPPED = """
WITH movie_pool AS (
  SELECT id FROM movies ORDER BY id LIMIT ? OFFSET ?
)
SELECT r.*, m.title, m.genre, m.director
FROM reviews r
JOIN movie_pool p ON r.id = p.id
JOIN movies m ON r.id = m.id
"""

_pool_cache: dict[int, list[dict]] = {}
def get_rows(n_movies: int) -> list[dict]:
    if n_movies in _pool_cache:
        return _pool_cache[n_movies]

    if REVIEWS_PER_MOVIE is not None:
        result_df = con.execute(CTE_SQL_CAPPED, [n_movies, S, REVIEWS_PER_MOVIE]).df()
    else:
        result_df = con.execute(CTE_SQL_UNCAPPED, [n_movies, S]).df()
    rows = result_df.to_dict("records")
    _pool_cache[n_movies] = rows

    cap_desc = "all reviews (no cap)" if REVIEWS_PER_MOVIE is None else f"capped at {REVIEWS_PER_MOVIE}/movie"
    print(f"N={n_movies} movies -> {len(rows)} review rows ({cap_desc})")
    return rows

# ---------------------------------------------------------------------------
# STEP 2 — DocETL-STYLE OPERATORS
#
#   Filter: question prompt over each document, decision from a JSON boolean
#           field ("keep") — mirrors DocETL's filter, whose output schema must
#           contain a boolean that determines inclusion.
#   Reduce: group documents by reduce_key, one prompt per group with the
#           group's documents concatenated, result from a JSON "summary" field.
# JSON-instruction suffixes emulate DocETL's structured_output mode, since our
# offline engine doesn't do tool calling.
# ---------------------------------------------------------------------------

FILTER_OUTPUT_INSTRUCTION = (
    "\n\nRespond with a JSON object matching this schema, and nothing else:\n"
    '{"keep": boolean}\n'
    '"keep" is true if the condition holds for this document, false otherwise.'
)

REDUCE_OUTPUT_INSTRUCTION = (
    "\n\nRespond with a JSON object matching this schema, and nothing else:\n"
    '{"summary": string}'
)


def _extract_json(text: str) -> dict | None:
    """
    Tolerant JSON extraction: models sometimes wrap JSON in ```json fences or
    add stray text. Grab the first {...} span and parse it.
    """
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        return None
    try:
        return json.loads(text[start:end + 1])
    except json.JSONDecodeError:
        return None


class DocETLFilter:
    """
    DocETL `filter` operation semantics: a condition prompt over each document,
    keep the document iff the boolean output field is true.

    `question` is the condition phrased as a question; the document text is
    appended after it (equivalent to a DocETL prompt of
    "<question>\\n\\n{{ input.<text_col> }}").
    """

    def __init__(self, name: str, question: str, text_col: str = "reviewText"):
        self.name = name
        self.question = question
        self.text_col = text_col

    def build_prompts(self, rows: list[dict]) -> list[str]:
        return [
            f"{SYSTEM_PROMPT}\n\n{self.question}\n\n{r[self.text_col]}"
            f"{FILTER_OUTPUT_INSTRUCTION}"
            for r in rows
        ]

    def apply(self, rows: list[dict], outputs: list[str]) -> list[dict]:
        kept = []
        n_parse_fail = 0
        for r, out in zip(rows, outputs):
            parsed = _extract_json(out)
            if parsed is None:
                n_parse_fail += 1
                keep = "true" in out.lower()   # fallback heuristic
            else:
                keep = bool(parsed.get("keep", False))
            if keep:
                kept.append(r)
        if n_parse_fail:
            print(f"  [{self.name}] WARNING: {n_parse_fail}/{len(rows)} outputs "
                  f"failed JSON parse (used fallback)")
        return kept


class DocETLReduce:
    """
    DocETL `reduce` operation semantics: group documents by reduce_key, one
    prompt per group, result from the JSON "summary" field.

    `instruction_template` may contain a {key} placeholder, filled with the
    group's reduce_key value.
    """

    def __init__(self, name: str, reduce_key: str, instruction_template: str,
                 text_col: str = "reviewText"):
        self.name = name
        self.reduce_key = reduce_key
        self.instruction_template = instruction_template
        self.text_col = text_col

    def build_prompts(self, rows: list[dict]) -> tuple[list[str], list]:
        groups: dict = {}
        for r in rows:
            groups.setdefault(r[self.reduce_key], []).append(r)

        prompts, keys = [], []
        for key, group_rows in groups.items():
            joined = "\n\n---\n\n".join(r[self.text_col] for r in group_rows)
            instruction = self.instruction_template.format(key=key)
            prompts.append(
                f"{SYSTEM_PROMPT}\n\n{instruction}\n\n{joined}"
                f"{REDUCE_OUTPUT_INSTRUCTION}"
            )
            keys.append(key)
        return prompts, keys

    def apply(self, keys: list, outputs: list[str]) -> list[dict]:
        results = []
        for k, out in zip(keys, outputs):
            parsed = _extract_json(out)
            summary = parsed.get("summary", out) if parsed else out  # fallback: raw text
            results.append({self.reduce_key: k, "result": summary})
        return results


# ---------------------------------------------------------------------------
# STEP 3 — QUERY DEFINITIONS
# ---------------------------------------------------------------------------

def query_1_disappointment_filter(rows, worker, log):
    op = DocETLFilter(
        name="disappointment_filter",
        question="Does this review express disappointment with the ending?",
    )
    prompts = op.build_prompts(rows)
    outputs = call_operator(worker, op.name, prompts, max_tokens=2048, log=log)
    result_rows = op.apply(rows, outputs)
    return [{"reviewText": r["reviewText"]} for r in result_rows]


def query_2_technique_summary_per_movie(rows, worker, log):
    filter_op = DocETLFilter(
        name="technique_filter",
        question=("Does this review credit a specific technique, scene, or "
                  "choice for its emotional impact?"),
    )
    prompts = filter_op.build_prompts(rows)
    outputs = call_operator(worker, filter_op.name, prompts, max_tokens=None, log=log)
    filtered_rows = filter_op.apply(rows, outputs)

    reduce_op = DocETLReduce(
        name="technique_summary_reduce",
        reduce_key="title",
        instruction_template=(
            "These are reviews of the film '{key}'. Summarize the specific "
            "filmmaking techniques, scenes, or choices reviewers credit for "
            "the film's emotional effect."
        ),
    )
    reduce_prompts, movie_keys = reduce_op.build_prompts(filtered_rows)
    reduce_outputs = call_operator(worker, reduce_op.name, reduce_prompts,
                                   max_tokens=None, log=log)
    return reduce_op.apply(movie_keys, reduce_outputs)


QUERIES = {
    "q1_disappointment_filter": query_1_disappointment_filter,
    "q2_technique_summary_per_movie": query_2_technique_summary_per_movie,
    # add remaining non-join queries here, same signature: (rows, worker, log) -> result
}


# ---------------------------------------------------------------------------
# STEP 4 — OPERATOR CALL + LOGGING
# ---------------------------------------------------------------------------

def call_operator(worker, operator_name, prompts, max_tokens, log: list) -> list[str]:
    if not prompts:
        return []

    t0 = time.time()
    result = worker.generate_batch.remote(prompts, max_tokens)
    wall = time.time() - t0

    log.append({
        "operator": operator_name,
        "n_prompts": len(prompts),
        "wall_time_s": wall,
        "worker_wall_time_s": result["wall_time_s"],   # GPU-side time, excludes network/cold-start
        "gpu": result["gpu"],
        "quantization": result["quantization"],
        "per_request": result["per_request"],
        "vllm_metrics": result["vllm_metrics"],
    })

    print(f"  [{operator_name}] {len(prompts)} prompts, {wall:.2f}s wall time "
          f"({result['wall_time_s']:.2f}s on-worker)")
    return [r["text"] for r in result["per_request"]]


# ---------------------------------------------------------------------------
# STEP 5 — RUN THE FULL SWEEP: grid x query x N
# ---------------------------------------------------------------------------

def get_worker(gpu: str, quantization: str):
    if gpu != "H100":
        raise ValueError(f"Only H100 is deployed this round, got {gpu!r}")
    Worker = modal.Cls.from_name(APP_NAME, "WorkerH100")
    return Worker(quantization=quantization, enable_prefix_caching=True)


def run_all():
    all_logs = []

    for gpu, quant in GRID:
        print(f"\n{'=' * 70}\nGRID CELL: gpu={gpu} quant={quant}\n{'=' * 70}")
        worker = get_worker(gpu, quant)

        for query_name, query_fn in QUERIES.items():
            for n in N_SWEEP:
                print(f"\n--- query={query_name} n={n} gpu={gpu} quant={quant} ---")
                rows = get_rows(n)

                per_call_log = []
                t0 = time.time()
                result = query_fn(rows, worker, per_call_log)
                total_wall = time.time() - t0

                for entry in per_call_log:
                    entry.update({"query": query_name, "n": n, "model": MODEL_NAME})
                    all_logs.append(entry)

                print(f"  query total wall time: {total_wall:.2f}s, "
                      f"result size: {len(result)}")

    with open(OUTPUT_LOG_PATH, "w") as f:
        json.dump(all_logs, f, indent=2, default=str)
    print(f"\nSaved {len(all_logs)} operator-call logs to {OUTPUT_LOG_PATH}")
    return all_logs


# ---------------------------------------------------------------------------
# STEP 6 — QUICK ANALYSIS HELPER
# ---------------------------------------------------------------------------

def summarize(all_logs: list[dict]) -> pd.DataFrame:
    rows = []
    for entry in all_logs:
        e2e_latencies = [r["e2e_latency"] for r in entry["per_request"] if r["e2e_latency"] is not None]
        rows.append({
            "query": entry["query"],
            "operator": entry["operator"],
            "gpu": entry["gpu"],
            "quantization": entry["quantization"],
            "n": entry["n"],
            "n_prompts": entry["n_prompts"],
            "wall_time_s": entry["wall_time_s"],
            "worker_wall_time_s": entry["worker_wall_time_s"],
            "mean_e2e_latency": sum(e2e_latencies) / len(e2e_latencies) if e2e_latencies else None,
            "throughput_req_per_s": entry["n_prompts"] / entry["wall_time_s"] if entry["wall_time_s"] else None,
        })
    return pd.DataFrame(rows)


if __name__ == "__main__":
    logs = run_all()
    summary_df = summarize(logs)
    print("\n=== SUMMARY (per operator call) ===")
    print(summary_df.to_string(index=False))
    summary_df.to_csv("benchmark_summary.csv", index=False)
    print("\nSaved summary table to benchmark_summary.csv")