# HYPERMEM ONTOLOGY
---
VERSION: 1.1.0
UPDATED: 2026-01-08
---

```
ENTITIES
├── AGENT (name, model, function)
├── CONTEXT (Org, Project)
├── OBJECT (Language, Database, Framework, Lib, Tool, API, Model, ...)
├── MEM (Decision, Problem, Rule, BestPractice, Version, ...)
├── TRACE (SessionLog, Event, Snapshot, CheckResult)
└── REFERENCE (url, doc, commit, pr, adr, ticket, ...)
```

Universal MEM structure (no per-MEM "symptoms/area/etc." fields).
Actor is a field on MEM (enum array: human|agent), not a separate entity.

---

## Entities

### AGENT

```
AGENT
├── name (string, indexed)
├── model (string) - e.g., "gpt-5.2-2025-12-11"
└── function (string) - agent's purpose/role
```

> "AI agent instance that proposed/created a MEM."

---

### CONTEXT

```
CONTEXT
├── Org
└── Project
```

> "Where does this apply?"

---

### OBJECT

```
OBJECT
├── Language (TypeScript, Python, JavaScript)
├── Database (MongoDB, Neo4j, HelixDB, Redis)
├── Framework (Next.js, React, FastAPI, TailwindCSS)
├── Lib (Zustand, shadcn/ui, Radix UI, dnd-kit)
├── Tool (npm, Poetry, Docker, Jest)
├── API (Vercel AI SDK, Clerk, Langfuse)
├── Model (GPT, Claude Opus, Claude Sonnet)
├── Component
├── Service
├── Font (Geist, Urbanist, JetBrains Mono)
├── Stack
└── Template
```

> "What item/thing is this about?"

---

### MEM

```
MEM
├── Decision
├── Problem
├── Rule
├── BestPractice
├── Convention
├── AntiPattern
├── Trait
├── Preference
├── Causal          ← can have HAS_CAUSE / HAS_EFFECT edges
└── Version         ← linked to Model OBJECT via VERSION_OF edge
```

> MEM is the curated, queryable unit that can be updated via superseding/contradiction.

---

### TRACE

Internal records produced by the system.

```
TRACE
├── SessionLog
├── Event
├── Snapshot
└── CheckResult
```

> "What happened internally."

---

### REFERENCE

External sources and artifacts.

```
REFERENCE
├── url
├── doc
├── commit
├── pr
├── adr
├── ticket
├── meeting_note
└── ...
```

> "What external source backs this."

---

## Universal MEM structure

This is the **same field set for every MEM type** (Decision/Problem/Rule/… all identical structurally).

### Required fields (minimal)

* `id` (uuid)
* `mem_type` (enum: Decision|Problem|Rule|BestPractice|Convention|AntiPattern|Trait|Preference|Causal|Version)
* `mem_state` (enum: `FACT | ASSUMPTION`)
* `confidence` (enum: `low | med | high`) **only if** `mem_state=ASSUMPTION`
* `statement` (canonical natural-language statement; the "memory payload") claim
* `created_at`
* `actors` (enum array: `human | agent`) - who contributed to this MEM

### Universal lifecycle fields (strongly recommended)

* `status` (enum: `ACTIVE | SUPERSEDED | CONTESTED | ARCHIVED`)
* `last_validated_at` (timestamp, optional but important)

### Universal utility fields (optional)

* `title` (short label; derived from statement if missing)
* `tags` (string[])
* `notes` (free text; nuance/rationale; **not** a schema explosion)
* `valid_from` / `valid_to` (timestamps; for time-bounded truth/in-effect windows)

### Universal edges every MEM uses

* `ABOUT → Object`
  "What this MEM is about."
* `IN_CONTEXT → Context`
  "Where it applies."
* `PROPOSED_BY_AGENT → Agent`
  "Which AI agent proposed/created this MEM." (optional, for agent-created MEMs)
* `VERSION_OF → Object`
  "Which Model this Version MEM describes." (only for Version MEMs)
* `HAS_EVIDENCE → (Trace | Reference)`
  "What backs this memory."

### How we avoid MEM-type specific fields

Instead of "symptoms/area/tradeoffs fields", you encode specifics via:

1. the `statement` (canonical form)
2. `tags` (for retrieval)
3. links to **Trace** or **Reference** via `HAS_EVIDENCE` that contain the rich structured detail

This keeps MEM schema stable while still allowing richness.

---

## TRACE structure

* `id`
* `trace_type` (SessionLog|Event|Snapshot|CheckResult)
* `timestamp` (occurred_at or recorded_at)
* `summary` (human readable)
* `payload` (optional structured blob)

---

## REFERENCE structure

* `id`
* `ref_type` (url|doc|commit|pr|adr|ticket|meeting_note|…)
* `title`
* `uri` (optional)
* `retrieved_at`
* `snippet` (optional)
* `full_text` (optional)

---

## Relations

```text
ABOUT
  MEM -> Object
  What this memory is primarily about.

IN_CONTEXT
  MEM -> Context
  Scope boundary where the memory applies.

PROPOSED_BY_AGENT
  MEM -> Agent
  Which AI agent proposed/created this MEM.

VERSION_OF
  MEM(Version) -> Object(Model)
  Links a Version MEM to its Model object.

HAS_EVIDENCE
  MEM -> (Trace | Reference)
  Points to internal records or external sources that back this memory.

SUPERSEDES
  MEM -> MEM
  Newer/current MEM replaces older MEM (old becomes SUPERSEDED).

CONTRADICTS
  MEM -> MEM
  Cannot both be true/in-effect in the same context (drives CONTESTED).

DEPENDS_ON
  MEM -> (MEM | Object)
  Prerequisite relationship.

HAS_CAUSE
  MEM(Causal) -> MEM
  Endpoint relation for causal memories.

HAS_EFFECT
  MEM(Causal) -> MEM
  Endpoint relation for causal memories.

RELATED
  MEM -> MEM
  Generic association fallback (avoid overuse).
```

---

## OPERATIONAL RULES

1. **Updates are append-only:** never overwrite a MEM; create a new MEM and `SUPERSEDES` the old one.
2. **FACT vs ASSUMPTION only:**
   * FACT = treated as "in effect / true" (100% for your system)
   * ASSUMPTION = not fully verified; must include confidence low/med/high
3. **Conflicts:** link `CONTRADICTS` and mark at least one as `CONTESTED`.
4. **Evidence:** every MEM should have at least one `HAS_EVIDENCE → (Trace | Reference)`.
5. **Causality:** put causality into `Causal` MEM with `HAS_CAUSE/HAS_EFFECT`.
6. **Actors:** use `actors` field (human|agent array) to track who contributed. For agent-created MEMs, also link `PROPOSED_BY_AGENT → Agent`.
7. **Versions:** use `Version` MEM type with `VERSION_OF → Object(Model)` edge to track model versions.