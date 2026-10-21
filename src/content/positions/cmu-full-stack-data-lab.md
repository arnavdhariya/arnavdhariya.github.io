---
lab: Full Stack Data Lab
org: Carnegie Mellon University
role: Visiting Researcher
advisor: Prof. Shreya Shankar
logo: /logos/fsdatalab.png
start: July 2026
end: Present
order: 1
draft: true
tags: []
links:
  - label: Lab
    href: https://fsdatalab.github.io/
  - label: Quail (open source)
    href: https://github.com/fsdatalab/quail
  - label: AI filter cost estimates
    href: https://fsdatalab.github.io/blog/ai-filter-cost-estimates/
---
- Co-designed and implemented Quail, an execution engine for AI-native SQL operators on vLLM that combines prefix/KV-cache reuse with recurrent-state checkpointing for hybrid models, achieving 3–4x lower latency than default vLLM at identical accuracy across Qwen3, Qwen3.5, Qwen3.8, and LFM models.
- Profiled a vLLM benchmark with NVIDIA Nsight Systems and PyTorch Profiler, finding that semantic operators saturate the KV cache and trigger frequent evictions, which drove Quail's design. Authored the cost-model analysis for AI filters, an ideal-cost baseline no system has yet reached, and am designing a follow-on optimization to close the gap.
