# Provenance

This document is the rights ledger for every source that touched this dataset. The rule it enforces: **cite anything; adapt only what the licence permits; attribute everything adapted.**

## Layer 1 — Authored content (ours)

The overwhelming majority of topic text, evidence criteria, crit prompts, edge reasons, and cluster summaries is **original work by Logika by RBDS AI Lab**, authored from the published essays, books-in-progress, workshop curricula, and teaching practice of **Sahil Tanveer**. Topics marked `stance: "POSITIONAL"` are openly declared stances from that body of work, each anchored to the text it comes from. Licence: **CC BY-SA 4.0** (see LICENSE-CONTENT).

## Layer 2 — Adapted content (attributed)

**Marble Skill Taxonomy** (`github.com/withmarbleapp/os-taxonomy`, by Marble / Generative Spark, Inc.)
- Database licence: ODbL 1.0 · Authored text: CC BY-SA 4.0 — both compatible with this dataset's licence pair.
- **What we adapted:** the 22 on-ramp topics (ids beginning `dt_bridge-`), each derived from named Marble micro-topics (the source `mt_` ids are recorded in each topic's `grounding`). Text was adapted, not copied verbatim; every adapted topic carries `"attribution": "adapted from Marble Skill Taxonomy, CC BY-SA 4.0"`.
- We also follow Marble's structural pattern (micro-topics, hard/soft prerequisite edges with reasons, validator + manifest + this file's codes-only approach). Patterns and ideas are not copyrightable; the debt is acknowledged with thanks.
- **Note:** Marble (withmarble.com, children's education) is unrelated to other products named Marble.

## Layer 3 — Framework alignment (codes-only)

These frameworks are referenced by **code/name only** in `standards` fields. No framework prose is reproduced in this dataset.

| Framework | Key prefix | Rights status | Our use |
|---|---|---|---|
| UNESCO AI Competency Framework for Students (2024, Miao & Shiohira) | `unesco-aicfs:` | CC BY-SA 3.0 IGO (verified on the document) | **Codes only** (`CG4.x.y.z` + block names as factual identifiers). We deliberately do not adapt UNESCO prose, avoiding share-alike entanglement of derived text. |
| AI Samarth — AI Literacy Curriculum Framework (Central Square Foundation + WSAI IIT Madras, May 2025) | `ai-samarth:` | No licence stated; all-rights-reserved assumed | **Pillar names only**, as factual identifiers, with this citation: *Central Square Foundation (2025, May). AI Samarth: AI Literacy Curriculum Framework for Students.* |

## Layer 4 — Grounding anchors (citation only, no text reuse)

Topics cite these sources as **grounding anchors** — evidence that a factual claim is field-consensus. **No text from any of them appears in this dataset.** Their licences were individually verified; those marked NC (non-commercial), ND (no-derivatives), or proprietary cannot be adapted here and are cited only.

- Published essays and workshop materials of Sahil Tanveer / RBDS AI Lab (own IP).
- Google Machine Learning Crash Course — CC BY 4.0 (adaptable in principle; used as anchor only in v0).
- Wikipedia / Wikiversity — CC BY-SA 4.0 (adaptable in principle; used as anchor only in v0).
- MIT OpenCourseWare (CC BY-NC-SA 4.0) · Elements of AI (proprietary) · Day of AI / MIT RAISE (CC BY-NC-SA 4.0) · Experience AI, Google DeepMind + Raspberry Pi Foundation (CC BY-NC-ND 4.0) · Anthropic Courses on GitHub (CC BY-NC 4.0) · OpenAI Academy (proprietary) · DeepLearning.AI "AI for Everyone" (proprietary) · fast.ai course text (no-redistribution) · TU Delft "AI in Architectural Design" MOOC (no open licence found) — **all anchor-only**.
- Peer-reviewed / canonical references cited in `grounding` (e.g. Bommasani et al. 2021 on foundation models; Rudin 2019 on interpretability; Goodfellow et al. 2015 on adversarial examples; Peña & Parshall, *Problem Seeking*; Lynch, *The Image of the City*) — standard citation practice.

## What is deliberately excluded

- **No per-student data.** This dataset never contains learner records.
- **No UNESCO / framework prose.** Codes only (see Layer 3).
- **No text from NC/ND/proprietary sources.** Anchors only (see Layer 4).
- **No embeddings.** Recomputable from the data.

## Integrity

`data/manifest.json` carries SHA-256 checksums for every data file. `scripts/validate.mjs` re-verifies structure, referential integrity, acyclicity, stance/grounding rules, attribution presence on adapted topics, and checksums — with no dependencies.
