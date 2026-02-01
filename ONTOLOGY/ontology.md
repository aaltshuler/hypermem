# HYPERMEM ONTOLOGY
---
UPDATED: 2026-02-01
---

```
ENTITIES
├── AGENT (name, model, function)
├── CONTEXT (Org, Project, Domain, Stage)
├── OBJECT (Language, Database, Framework, Lib, Tool, API, Model, ...)
├── MEM (Decision, Problem, Rule, BestPractice, Lexicon, Trait, Version)
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
├── org      - Organization
├── project  - Specific project/repo
├── domain   - Knowledge domain
│   ├── ReactDev        - React/Next.js/UI development
│   ├── AgentDev        - AI agent development and LLM integration
│   ├── DataPipelines   - Data processing, ETL, workflows
│   ├── KnowledgeGraphs - Graph databases, ontologies, semantic modeling
│   ├── CLI             - Command line tools and interfaces
│   └── Deploy          - Deployment, infrastructure, cloud platforms
└── stage    - Lifecycle stage (development, production, deprecated)
```

> "Where does this apply?"
> Objects can be linked to domains via PART_OF edge.

---

### OBJECT

```
OBJECT
├── language (TypeScript, Python, JavaScript)
├── database (MongoDB, Neo4j, HelixDB, Redis, Supabase, Neon)
├── framework (Next.js, React, FastAPI, TailwindCSS)
├── lib (Zustand, shadcn/ui, Radix UI, dnd-kit, Prefect)
├── tool (npm, Poetry, Docker, Jest, Vercel, AWS, Terraform)
├── api (Vercel AI SDK, Mastra, pydantic-ai, Anthropic SDK, Clerk, Langfuse)
├── llm (GPT, Claude Opus, Claude Sonnet, Claude Haiku)
├── component
├── service
├── font (Geist Sans, Geist Mono, Urbanist, JetBrains Mono)
├── stack
└── template
```

> "What item/thing is this about?"

---

### MEM

```
MEM
├── decision      - Architectural, technical, or process decisions
├── problem       - Known issues, bugs, or challenges
├── rule          - Hard rules that must be followed (includes things to avoid)
├── bestPractice  - Recommended practices or approaches
├── lexicon       - High-bandwidth shorthand vocabulary (e.g., "W" = width, "P" = padding)
├── trait         - Personal characteristics or working styles
└── version       - Specific version of a library, framework, model, or tool
                    (linked to llm OBJECT via VERSION_OF edge)
```

> MEM is the curated, queryable unit that can be updated via superseding/contradiction.
> Note: AntiPatterns are now Rules (negative rules are still rules). Causal relationships
> use the CAUSAL edge between MEMs instead of a separate MEM type.

---

### TRACE

Internal records produced by the system.

```
TRACE
├── sessionlog
├── event
├── snapshot
└── checkresult
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
├── meetingNote
└── ...
```

> "What external source backs this."

---

## Universal MEM structure

This is the **same field set for every MEM type** (Decision/Problem/Rule/… all identical structurally).

### Required fields (minimal)

* `id` (uuid)
* `mem_type` (enum: decision|problem|rule|bestPractice|lexicon|trait|version)
* `mem_state` (enum: `fact | assumption`)
* `confidence` (enum: `low | med | high`) **only if** `mem_state=ASSUMPTION`
* `statement` (canonical natural-language statement; the "memory payload") claim
* `created_at`

### Universal lifecycle fields (strongly recommended)

* `status` (enum: `active | superseded | contested | dimmed`)
* `last_validated_at` (timestamp, optional but important)

### Universal utility fields (optional)

* `title` (short label; derived from statement if missing)
* `tags` (string[])
* `notes` (free text; nuance/rationale; **not** a schema explosion)
* `valid_from` / `valid_to` (timestamps; for time-bounded truth/in-effect windows)
* `reality_check` (boolean; if true, included in `hypermem reality-check` output)

### Universal edges every MEM uses

* `ABOUT → Object`
  "What this MEM is about."
* `ABOUT_REF → Reference`
  "What external source this MEM is about." (URLs, docs, commits)
* `IN_CONTEXT → Context`
  "Where it applies."
* `PROPOSED_BY_AGENT → Agent`
  "Which AI agent proposed/created this MEM." (optional, for agent-created MEMs)
* `VERSION_OF → Object`
  "Which Model this Version MEM describes." (only for Version MEMs)
* `HAS_EVIDENCE → Trace`
  "Internal trace that backs this memory."
* `HAS_EVIDENCE_REF → Reference`
  "External reference that backs this memory."

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
* `ref_type` (url|doc|commit|pr|adr|ticket|meetingNote|…)
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

ABOUT_REF
  MEM -> Reference
  What external source this memory is about.

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
  MEM -> Trace
  Points to internal records that back this memory.

HAS_EVIDENCE_REF
  MEM -> Reference
  Points to external sources that back this memory.

PART_OF
  Object -> Context
  Links an Object to a domain Context it belongs to.
  Example: Next.js PART_OF ReactDev, GPT PART_OF AgentDev

SUPERSEDES
  MEM -> MEM
  Newer/current MEM replaces older MEM (old becomes SUPERSEDED).
  Properties: { reason: String }

CONTRADICTS
  MEM -> MEM
  Cannot both be true/in-effect in the same context (drives CONTESTED).

DEPENDS_ON
  MEM -> MEM
  Prerequisite relationship.

CAUSAL
  MEM -> MEM
  Cause-effect relationship between memories.
  Properties: { description: String }
  Direction: cause -> effect (From is the cause, To is the effect)

RELATED
  MEM -> MEM
  Generic association fallback (avoid overuse).
  Properties: { weight: Float (0-1) }
```

> All edges have a `timestamp` property for idempotent upsert operations.

---

## OPERATIONAL RULES

1. **Updates are append-only:** never overwrite a MEM; create a new MEM and `SUPERSEDES` the old one.
2. **fact vs assumption only:**
   * fact = treated as "in effect / true" (100% for your system)
   * assumption = not fully verified; must include confidence low/med/high
3. **Conflicts:** link `CONTRADICTS` and mark at least one as `contested`.
4. **Evidence:** every MEM should have at least one `HAS_EVIDENCE → Trace` or `HAS_EVIDENCE_REF → Reference`.
5. **Causality:** use `CAUSAL` edge with description to link cause MEM → effect MEM.
6. **Authorship:** use `PROPOSED_BY_AGENT → Agent` edge to track agent-created MEMs. Human-created MEMs have no edge (default).
7. **Versions:** use `version` MEM type with `VERSION_OF → Object(llm)` edge to track model versions.
8. **Edge timestamps:** all edges include timestamps for idempotent UpsertE operations.
9. **Reality check:** set `reality_check=true` on MEMs that should appear in `hypermem reality-check` quick reminders.
10. **Domains:** use `PART_OF` edge to link Objects to domain Contexts (e.g., Next.js → ReactDev).