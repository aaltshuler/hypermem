# HYPERMEM ONTOLOGY
---
VERSION: 0.1.0
UPDATED: 2026-01-07
---

```
ENTITIES
├── ACTOR (Person, Agent)
├── CONTEXT (Org, Project)
├── OBJECT (Tool, Lib, Stack, API, ...)
├── MEM (Decision, Problem, Rule, BestPractice, ...)
├── TRACE (SessionLog, Event, Snapshot, CheckResult)
└── REFERENCE (url, doc, commit, pr, adr, ticket, ...)
```

Universal MEM structure (no per-MEM "symptoms/area/etc." fields).

---

## Entities

### ACTOR

```
ACTOR
├── Person
└── Agent
```

> "Who did/said/validated/decided."

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
├── Tool
├── Lib
├── Stack
├── Template
├── API
├── Model
├── Component
└── Service
```

> "What item/thing is this about?"

---

### MEM

```
MEM
├── Decision
├── **Problem**
├── Rule
├── BestPractice
├── Convention
├── AntiPattern
├── Trait
├── Preference
└── Causal          ← can have HAS_CAUSE / HAS_EFFECT edges
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
* `mem_type` (enum: Decision|Problem|Rule|BestPractice|Convention|AntiPattern|Trait|Preference|Causal)
* `mem_state` (enum: `FACT | ASSUMPTION`)
* `confidence` (enum: `low | med | high`) **only if** `mem_state=ASSUMPTION`
* `statement` (canonical natural-language statement; the “memory payload”) claim
* `created_at`

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
* `PROPOSED_BY → Actor`
  "Who created/curated this MEM."
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
  (MEM | Trace | Reference) -> (Actor | Object | Context)
  What this memory/trace/reference is primarily about.

IN_CONTEXT
  (MEM | Trace | Reference) -> Context
  Scope boundary where the memory applies.

PROPOSED_BY
  (MEM | Trace | Reference) -> Actor
  Who created/curated/recorded it.

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
  (any) -> (any)
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