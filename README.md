# TALAMANA — the Design-AI Literacy Taxonomy

An open, structured taxonomy of **AI literacy for architecture and design students** — decomposed into fine-grained micro-topics, wired into a prerequisite graph with a reason on every edge, and aligned to international competency frameworks. Produced by **Logika by RBDS AI Lab**, from the published work and teaching practice of **Sahil Tanveer**.

> **Version:** `v0.4` · **Topics:** 200 · **Prerequisite edges:** 391 · **Ages:** 11–22 · **Strands:** 6

**Explore it live:** [talamana.rbdsailab.com](https://talamana.rbdsailab.com) — the interactive map of this dataset. There are no shortcuts. But there is a path.

## What this is

Most AI-literacy material is either a flat list of competencies or a course locked inside a platform. This dataset is a **connected graph of learning** for the design disciplines:

- **200 micro-topics** — each a single teachable idea (e.g. *"Fifty images is gambling"*, *"Latent space — the field of possibilities"*), with a plain-language description, mastery **evidence** criteria, a **crit prompt**, an approximate age range, and full **grounding**.
- **391 prerequisite edges** — a directed acyclic graph: *topic X stands on prerequisite Y*, each edge tagged `hard`/`soft` with a one-line human-readable **reason**. Click any topic and trace everything it stands on. There is no jump from zero to mastery. There is a path, and it is walkable.
- **An on-ramp band (ages 11–15)** — 22 bridge topics adapted from the [Marble Skill Taxonomy](https://github.com/withmarbleapp/os-taxonomy) (CC BY-SA 4.0, attributed per topic), giving the graph a foundation in school-level probability, data, computing, and media literacy.
- **Framework alignment** — topics carry **codes-only** references to the UNESCO AI Competency Framework for Students (36 curricular-goal codes) and AI Samarth's four pillars.
- **Clusters** — faculty-facing one-paragraph summaries per strand and age band.

## Two things no other AI-literacy dataset has

**1. The `JUDGMENT` node type.** Generic AI literacy has no category for what design education actually certifies: judgment. Topics typed `JUDGMENT` can only be evidenced in a **studio crit** — each carries a `critPrompt` addressed to a reviewer, not a quiz engine. Design-AI literacy is not generic AI literacy plus tools. It has an epistemic layer generic frameworks cannot hold.

**2. The `stance` field.** Every topic declares itself:
- `FACTUAL` — field-consensus content, carrying **at least two independent grounding anchors** (frameworks, verified courses, peer-reviewed sources, published essays).
- `POSITIONAL` — an **openly declared authored stance** of the Lab (e.g. *"Fifty images is gambling, not iteration"*), anchored to the published text it comes from.

Most curricula hide their opinions inside their content. This one publishes its bias honestly: 126 factual topics, 74 positional ones, each marked.

## Doctrine

Two positions govern the whole graph:
- **Ethics is threaded, not boxed.** There is no terminal "ethics module." The Ethics & Provenance strand wires into every other strand.
- **Students direct AI; they do not build it.** The graph's ceiling is directing, judging, and choosing AI well — the architect steering the instrument, not engineering it.

## Strands

| Strand | Topics |
|---|---:|
| Generative Mechanics | 39 |
| Judgment | 37 |
| Studio Practice | 34 |
| Foundations | 33 |
| The Brief | 29 |
| Ethics & Provenance | 28 |

## Files

All data lives in [`data/`](data/) as UTF-8 JSON. See [`schema/`](schema/) for JSON Schemas and [`data/manifest.json`](data/manifest.json) for counts + SHA-256 checksums.

| File | What it holds |
|---|---|
| [`data/topics.json`](data/topics.json) | The micro-topics (graph **nodes**), with stance, grounding, evidence, crit prompts, and framework alignment keys. |
| [`data/dependencies.json`](data/dependencies.json) | Prerequisite **edges** (`topicId` stands on `prerequisiteId`), each with a reason. |
| [`data/frameworks.json`](data/frameworks.json) | The alignment frameworks (codes-only), with per-source rights notes. |
| [`data/clusters.json`](data/clusters.json) | Faculty-facing summaries per (strand, age band). |
| [`data/manifest.json`](data/manifest.json) | Counts, per-strand breakdown, per-file checksums. |

### A topic

```json
{
  "id": "dt_fifty-images-gambling",
  "type": "JUDGMENT",
  "subject": "Judgment",
  "domain": "Iteration discipline",
  "name": "Fifty images is gambling",
  "description": "Making fifty images and picking the closest one is gambling, not iteration. Real iteration changes one thing in the brief each cycle and knows why.",
  "ageRangeStart": 18, "ageRangeEnd": 20,
  "centrality": 0.85,
  "evidence": ["Run five cycles. Change one named thing in the brief each time, and say why.", "..."],
  "critPrompt": "For the image on the wall, can the student show the chain of decisions that made it, cycle by cycle?",
  "stance": "POSITIONAL",
  "grounding": [{ "source": "sahil-position", "ref": "fifty-images seed (Logika 2026-05-20)" }],
  "standards": ["unesco-aicfs:CG4.1.4.1", "ai-samarth:practical-applications"]
}
```

### A dependency

```json
{ "topicId": "dt_fifty-images-gambling", "prerequisiteId": "dt_curation-diagnostic", "strength": "hard",
  "reason": "Curation locates the slip that disciplined iteration then corrects" }
```

## Using it

Pure data — no runtime, no dependencies. Load the JSON and go.

Validate structure + referential integrity + checksums:

```bash
node scripts/validate.mjs
```

## Licensing

- **Database** (structure, IDs, relationships): [Open Data Commons ODbL 1.0](LICENSE). Build on it — including commercially, as a *produced work* — and your product stays yours. Extend the database itself and the extension stays open.
- **Authored text** (names, descriptions, evidence, reasons, summaries): [CC BY-SA 4.0](LICENSE-CONTENT).
- **Third-party frameworks**: NOT relicensed. See [`PROVENANCE.md`](PROVENANCE.md) — encumbered sources are referenced **codes-only**.
- 22 on-ramp topics adapt text from the Marble Skill Taxonomy (CC BY-SA 4.0); each carries its attribution.

## Provenance and honesty

Every claim in this dataset traces to a source (`grounding`), every authored stance declares itself (`stance`), and every adapted text carries attribution. The full rights ledger is [`PROVENANCE.md`](PROVENANCE.md). Nothing here pretends to be neutral that isn't.

---

**Logika by RBDS AI Lab** · from the practice and published work of Sahil Tanveer · Dharwad + Bengaluru, India
