# ONTOLOGY UPDATE

## Core model: separate “things” from “statements about things”

Right now your “Entities” list mixes two fundamentally different concepts:

* **Subjects (things in the world):** Project, Person, Org, Tool, Lib, Stack, Template…
* **Atoms (memory statements):** Fact, Assumption, Decision, Rule, Best-practice, Pattern…

This is the single biggest lever for getting clean logic + updateability.

### Proposed top-level hierarchy (minimal change, but clarifies everything)

**SUBJECT**

* Context: `Org`, `Project`, `Person`
* Artifact: `Tool`, `Lib`, `Stack`, `Template` *(and likely: System/Service, Model, Dataset — optional additions)*

**ATOM (Memory)**

* Descriptive: `Fact`, `Assumption`
* Prescriptive: `Decision`, `Rule`, `Convention`, `Best-practice`
* Procedural: `Know-how`, *(Template can be treated as Artifact + referenced by Know-how)*
* Conceptual: `Pattern`, `AntiPattern`
* Identity: `Trait`, `Style`, `Strength`, `Preference`
* Causal/Explanatory: `Cause`

**EVIDENCE**

* `Reference`

This lets you keep your existing node types, but the graph gets a **clean contract**:

> **Atoms are always about Subjects, supported by References, scoped to Context, and evolve via superseding/conflict links.**

---

## Relations: keep yours, add 2 that remove ambiguity

Your relations are a strong start. Two adjustments will prevent pain later.

### Keep

* `SUPERSEDES`, `CONTRADICTS`, `SUPPORTS`
* `DEPENDS_ON`
* `CAUSES`, `CAUSED_BY`
* `BLOCKED_BY`
* `FROM_SOURCE`, `AUTHORED_BY`
* `RELATED`

### Update `ABOUT` (important)

Right now `ABOUT` is described as “links atom to context”, but your example needs “links atom to tool/lib/etc”.

You’ll want **two distinct semantics**:

1. **`ABOUT`**: Atom → Subject (what it’s about)
2. **`IN_CONTEXT`** (or `SCOPED_TO`): Atom → Context (where it applies)

Without this split, you’ll constantly overload ABOUT and retrieval becomes messy.

UPD:

## Diary entries

Structured summaries of each session:
- Accomplishments (what was completed)
- Decisions (design choices made)
- Challenges (problems encountered)
- Key learnings (reusable insights)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  GENERATOR   │ ──▶ │  REFLECTOR   │ ──▶ │  VALIDATOR   │ ──▶ │   CURATOR    │
│              │     │              │     │              │     │              │
│ Pre-task     │     │ LLM pattern  │     │ Evidence     │     │ Deterministic│
│ context      │     │ extraction   │     │ gate against │     │ delta merge  │
│ hydration    │     │ from diary   │     │ history      │     │ (NO LLM!)    │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

#### Examples

* “Zod recent version is 4.2”

  * Atom(Assumption) `ABOUT → Zod`
  * Atom `IN_CONTEXT → Global` or omit context
* “Default tool for validation in all TS projects”

  * Atom(Decision/Rule) `ABOUT → Zod`
  * Atom `IN_CONTEXT → Org(SomeOrg)` (or a Stack like “TypeScript stack”)

If you truly want to avoid adding a new relation, you *can* encode scope as a property, but you’ll regret it once you start querying/merging.

---

## “Alive memory” = lifecycle + review mechanics + non-destructive updates

### The key principle

**Never overwrite an Atom to “update it”.**
Instead:

* create a new Atom
* link it to the old one via `SUPERSEDES`
* change statuses so retrieval picks the right one

This creates a **history** and makes the memory robust.

### Atom lifecycle states (recommended)

Use a small, consistent set of statuses across atom types:

* `DRAFT` (extracted by agent, not trusted yet)
* `PROPOSED` (candidate, awaiting confirmation/validation)
* `ACTIVE` (current best-known)
* `CONTESTED` (has credible contradiction)
* `SUPERSEDED` (replaced by a newer atom)
* `DEPRECATED` (no longer recommended/true, but kept for history)
* `ARCHIVED` (low retrieval priority; still searchable)

You can implement these as:

* a `status` property on Atom nodes
* plus edges `SUPERSEDES` / `CONTRADICTS`

### Review & decay (the “alive” part)

Every Atom should have:

* `last_validated_at`
* `next_review_at` (or `review_interval_days`)
* `confidence`

And you define per-type defaults like:

* Assumption: review often; confidence decays if not validated
* Decision: no decay; requires explicit supersession
* Best-practice: periodic review
* Fact: may be timeless or time-bound depending on subtype

---

## 4) Overall method (how the memory system works end-to-end)

### A. Ingestion → candidate atoms

The ingestion agent creates atoms with:

* `status=DRAFT`
* initial `confidence` based on extraction quality
* links to `Reference` (source provenance)

### B. Canonicalization (curation agent)

Curator resolves:

* entity identity (Zod vs zod vs “colinhacks/zod”)
* duplicates (same claim expressed differently)
* scope (org vs project vs global)

### C. Validation + promotion

Curator promotes DRAFT → PROPOSED → ACTIVE by:

* checking sources
* confirming with a decision log / meeting notes
* observing repeated evidence in code/projects

### D. Updating (supersession rather than overwrite)

When a new atom arrives that changes a previous one:

* new atom created
* link `new SUPERSEDES old`
* old becomes `SUPERSEDED`
* optionally link evidence: `SUPPORTS` / `FROM_SOURCE`

### E. Conflict handling

When two ACTIVE atoms disagree on the same “key”:

* link `CONTRADICTS`
* mark both `CONTESTED` or keep one ACTIVE and one CONTESTED depending on confidence rules
* optionally create a `Decision` atom as the resolution

### F. Retrieval rules (what the agent “remembers”)

When answering, the system should prefer:

1. `ACTIVE` over anything else
2. scope match (Project > Org > Global)
3. most recent validation
4. higher confidence
5. supported by stronger evidence

---

## 5) Make atoms “keyed” so superseding is deterministic

To update cleanly, the curator needs to know *when two atoms are competing for the same slot*.

Define a **claim key** for atoms that represent a “current value”.

Example key schema:

* `key = (atom_type, predicate, about_entity_id, scope_entity_id)`

Where `predicate` is a normalized field like:

* `latest_version`
* `default_validation_library`
* `recommended_for_typescript`
* `uses_count` (if you store aggregates)

Even if you keep `statement` as text, having a normalized `predicate` is what makes updates reliable.

---

## 6) Fields: a practical schema for each entity type

Below is a concrete “fields spec” that works well in a knowledge graph.

### 6.1 Common fields (ALL nodes)

Use for Subjects, Atoms, References:

* `id` (stable UUID)
* `type` (label/class)
* `title` (short human name)
* `summary` (1–3 sentences)
* `tags` (list)
* `created_at`
* `updated_at`

---

## 6.2 SUBJECT fields

### Project

* `name` / `title`
* `status` (active/paused/archived)
* `start_date`, `end_date` (optional)
* `org_id` (or edge to Org)
* `repo_links` / `docs_links` (optional)
* `domain` (e.g., payments, infra)
* `stack_refs` (edges to Stack/Tools/Libs or separate derived edges)
* `owners` (edges to Person)

### Person

* `display_name`
* `roles` (list)
* `org_id` (edge)
* `teams` (optional)
* `handles` (github, slack) (optional)
* `timezone` (optional)
* *(Identity atoms attach to Person via ABOUT/IN_CONTEXT)*

### Org

* `name`
* `domain` (company domain or business domain)
* `units/teams` (optional)
* `policies_index` (optional pointer to decisions/rules)

### Tool / Lib

Treat Tool and Lib similarly; differences are mostly category.

* `canonical_name`
* `ecosystem` (ts, python, rust…)
* `category` (validation, orm, testing…)
* `repo` / `homepage` (optional but useful)
* `aliases`
* *(Avoid storing “latest_version” as a Tool property; store it as an Atom so it can evolve.)*

### Stack

* `name`
* `description`
* `components` (edges to Tool/Lib)
* `scope` (Org-wide vs project-specific)

### Template

* `name`
* `purpose`
* `location` (repo path / URL)
* `inputs` / `outputs` (optional)
* `version` (template version, not tool version)
* `maintainer` (edge to Person/Org)

---

## 6.3 EVIDENCE fields

### Reference

References should be first-class so atoms can share sources.

* `ref_type` (doc, url, commit, PR, meeting_note, chat, ticket)
* `title`
* `uri` (if applicable)
* `authors` (optional)
* `published_at` (optional)
* `retrieved_at`
* `snippet` (small excerpt or summary)
* `hash` (content fingerprint if you store text)

---

## 6.4 ATOM fields (common to all memory atoms)

These are the core of “alive memory”.

* `statement` (human-readable)
* `predicate` (normalized key like `latest_version`) **strongly recommended**
* `value` (typed literal or entity reference)
* `status` (DRAFT/PROPOSED/ACTIVE/…)
* `confidence` (0–1 or 0–100)
* `importance` (low/med/high)
* `created_at`
* `last_validated_at`
* `next_review_at` (or `review_interval_days`)
* `valid_from` (optional)
* `valid_to` (optional / TTL)
* `notes` (rationale, nuance)
* `resolution` (optional: how conflict was resolved)

Edges:

* `ABOUT → Subject`
* `IN_CONTEXT → (Project | Org | Person | Stack | “Global”)`
* `FROM_SOURCE → Reference`
* `AUTHORED_BY → Person/Agent`
* `SUPPORTS/CONTRADICTS/SUPERSEDES → Atom`

---

## 6.5 Type-specific Atom fields and handling

### Fact (descriptive, should be durable or time-scoped)

Extra fields:

* `fact_kind`: `observed | derived | reported`
* `observed_count` (optional, if aggregated)
* `first_observed_at`, `last_observed_at` (optional)

Update logic:

* Facts may *accumulate* (usage count grows) or *supersede* (latest version changes).
* If fact is time-sensitive: set `valid_to` or short `review_interval_days`.

### Assumption (uncertain, must be validated)

Extra fields:

* `validation_method` (how to confirm)
* `risk_if_wrong` (low/med/high)
* `owner` (who should validate)
* `deadline` (optional; when it must be checked)

Update logic:

* If validated, either:

  * promote to `Fact`, or
  * keep as Assumption but mark `confidence=high` + `status=ACTIVE`
* If not validated by `next_review_at`: degrade confidence or mark `STALE`.

### Decision (organizational commitment; should be “confirmed”)

Extra fields:

* `decision_status`: `proposed | accepted | rejected | deprecated`
* `decided_at`
* `decision_makers` (edges to Person/Org)
* `rationale`
* `alternatives` (links to other Tools/Libs or Decision atoms)
* `consequences` (positive/negative)
* `review_trigger` (e.g., “revisit when scaling to X”)

Update logic:

* Decisions do **not** decay with time by default.
* They change via `SUPERSEDES` or explicit `decision_status=deprecated`.

Confirmation rule:

* A Decision becomes `accepted` only with a strong Reference (ADR, meeting note, PR, policy doc) or explicit user confirmation.

### Rule (normative constraint; enforceable)

Extra fields:

* `severity`: `must | should | may`
* `enforcement`: `manual | automated | lint | CI`
* `exceptions` (conditions + process)
* `owner` (who maintains the rule)

Update logic:

* Similar to Decision, but often more operational; likely scoped to Org/Project.

### Best-practice (recommendation that should be re-verified)

Extra fields:

* `goal` (why it exists)
* `applicability` (conditions; can be edges or text)
* `tradeoffs`
* `review_interval_days` (default: 180 or 365)
* `evidence_quality` (low/med/high)

Update logic:

* Must be periodically revalidated.
* If outdated: mark `status=NEEDS_REVIEW` (or `CONTESTED`) and lower confidence.

### Know-how (procedural)

Extra fields:

* `steps` (structured list or markdown)
* `inputs`, `outputs`
* `tools_required` (edges)
* `examples` (links to repos/templates)
* `last_tested_at` (when last confirmed it works)

Update logic:

* Review when dependencies change (`DEPENDS_ON`) or periodically.

### Convention (soft rule for consistency)

Extra fields:

* `area`: naming | formatting | repo layout | docs | testing style
* `examples_good` / `examples_bad`
* `severity` usually `should`
* `owner`

Update logic:

* Similar to Best-practice; tends to be local (Org/team/project).

### Pattern / AntiPattern

Extra fields (Pattern):

* `problem`
* `context`
* `solution`
* `forces`
* `tradeoffs`
* `examples`

Extra fields (AntiPattern):

* `symptoms`
* `why_it_happens`
* `consequences`
* `refactoring_path`

Update logic:

* Rarely expires, but may need review when ecosystem changes.

### Trait / Style / Strength / Preference (identity atoms)

Extra fields:

* `subject_person_or_org` (via ABOUT)
* `polarity` (e.g., strong/medium/weak)
* `evidence` (observations, feedback references)
* `stability` (low/med/high)
* `review_interval_days` (e.g., 180–365)

Update logic:

* Don’t supersede frequently unless there’s a clear change; allow “trend” rather than flipping.

### Cause (explanatory link that often changes with new evidence)

Extra fields:

* `cause_kind`: root | contributing | correlational
* `effect_entity_or_atom` (edge)
* `mechanism` (short explanation)
* `confidence`
* `evidence_quality`

Update logic:

* Often starts as Assumption-like and becomes stronger with evidence.
* Frequently `CONTRADICTS` other hypotheses until resolved.

---

## 7) Your Zod example, re-modeled with clean semantics

### Subject

* `Lib: Zod`

### Atoms

**Assumption Atom**

* `predicate: latest_version`
* `value: "4.2"`
* `status: ACTIVE`
* `confidence: 0.7`
* `last_validated_at: 2025-11-14`
* `next_review_at: 2025-12-14` (example cadence)
* Edges: `ABOUT → Zod`, `FROM_SOURCE → (release notes ref)`

When 4.3 appears:

* create new Assumption/Fact atom with value 4.3
* link `4.3 SUPERSEDES 4.2`
* mark 4.2 atom `SUPERSEDED`

**Decision Atom** (this is not really an Assumption)

* `predicate: default_validation_lib`
* `value: Zod` (entity reference)
* `decision_status: accepted`
* `decided_at: 2025-10-14`
* `scope: IN_CONTEXT → Org` (or a specific Stack)
* `rationale: consistency + ecosystem fit`
* `enforcement: lint/template requirement` (optional)
* Edges: `ABOUT → Zod`, `IN_CONTEXT → Org`, `FROM_SOURCE → ADR`

**Fact Atom** (usage)
Option A (recommended): store as relationships and derive the count

* `ProjectA USES Zod`
* `ProjectB USES Zod`
* `ProjectC USES Zod`
  Then compute “used in ≥3 projects” as a derived fact.

Option B: store aggregate fact directly

* `predicate: used_in_projects_count`
* `value: 3`
* `fact_kind: derived`
* `last_observed_at: …`
* `SUPPORTS` edges pointing to the 3 usage facts / USES edges

---

## 8) What the curator agent actually does (the “dedicated agent” job)

A good curator loop is basically:

1. **Extract** candidate atoms (`DRAFT`)
2. **Resolve entities** (dedupe + canonical names)
3. **Assign keys** (`predicate`, `ABOUT`, `IN_CONTEXT`)
4. **Check collisions** (same key already has ACTIVE)
5. If collision:

   * if new is better → `SUPERSEDES`
   * if unclear → `CONTRADICTS` + mark `CONTESTED`
6. **Set review schedule** based on type defaults
7. **Promote** to `ACTIVE` when validation criteria met
8. **Age/decay**: mark stale items `NEEDS_REVIEW`, lower confidence

---

## Reflection

Analyze this session diary and extract actionable rules.
For each pattern you identify:
1. Formulate as an imperative rule ("Always...", "Never...", "When X, do Y")
2. Categorize (testing, debugging, git, architecture, etc.)
3. Assess scope (global, workspace, language, framework)
4. Provide reasoning for why this is valuable

Output format: JSON array of proposed rules

