**Two pipelines**:

1. a **write-path** that turns raw interaction into *clean, updateable* memory
2. a **read-path** that turns a user query into *the smallest useful atomic fact* for the model

---

## Schema that matches how memory actually behaves

Design your Helix schema around **atomic units** and **provenance**

**Core nodes you’ll likely need**

* `MemoryAtom`: the smallest claim you want to store (“User prefers X”, “Project uses Y”)
* `Entity`: people/orgs/projects/tools/topics (optional but powerful)
* `Source`: message IDs, docs, URLs (where did this come from?)
* `Session` / `Thread`: for grouping + scope boundaries
* `Embedding`: (often just a vector field on `MemoryAtom`)

**Core edges**

* `ABOUT` (MemoryAtom → Entity)
* `FROM_SOURCE` (MemoryAtom → Source)
* `IN_SESSION` (Source → Session)
* `SUPERSEDES` / `CONTRADICTS` (MemoryAtom → MemoryAtom)
* `RELATED` (Entity ↔ Entity)

Why: most “agent memory” pain comes from **changes over time** (updated preferences, new decisions). Model it explicitly with edges + timestamps.

---

## Your write-path matters more than your vector search

Do *not* store raw transcripts and hope retrieval saves you. Build a deterministic-ish ingestion pipeline:

**Write-path stages**

1. **Classify**: does this message contain memory-worthy info? (preference, decision, constraint, bug fix, recurring task…)
2. **Extract** into atomic facts (short, single-claim statements)
3. **Normalize** (entities, units, canonical names)
4. **Dedupe / merge**:
   * exact match + near-dup (embedding similarity)
   * update vs supersede vs noop
5. **Attach provenance** (who said it, when, where)
6. **Embed** (store vector for semantic recall)

TS tip: make this pipeline **idempotent** (same input event ID → same DB mutations). That saves you later when retries happen.

---

## Retrieval should be hybrid: vector → graph expansion → rerank → compress

HelixDB’s value is that a single query can do “semantic candidates” then “walk the graph” (vector + traversal). ([HelixDB][2])

A common pattern:

1. **Vector search** on `MemoryAtom` to get top-K candidates
2. **Graph expansion**:

   * pull connected entities
   * pull superseding/contradicting facts
   * pull related atoms in same topic/project
3. **Rerank** with a score like:

   * semantic similarity
   * recency / “last verified”
   * importance (you store this)
   * graph distance / edge type (ABOUT beats RELATED)
4. **Compress** into a tight “memory context” (token budgeted)

The “compress” step is where most systems win/lose: you want *the fewest* bullets that change the model’s answer.

---

## Treat memory as **data**, not instructions (prompt-injection resistant)

When you inject memory back into the model:

* format it as **facts with provenance**
* avoid imperative language (“You must…”) unless it’s truly a policy

Also add an allowlist: e.g., only certain memory types can influence “how the agent behaves”.

---

## You’ll want explicit lifecycle + privacy from day 1

Even for a “toy” project:

* per-user / per-workspace isolation
* delete endpoints (“forget X”, “delete memory id”)
* retention policies (auto-expire low-importance atoms)
* PII redaction (at least basic patterns)
* auditability: *why did this memory get returned?*

If you don’t build this early, your memory store turns into an unfixable junk drawer.

---

## TypeScript-specific architecture choices

### Use the existing building blocks

* **helix-ts** exists and is designed for type-safe HelixDB queries from TS. ([HelixDB Docs][3])
* If you expose this to agents via **MCP**, the official TypeScript SDK is available and uses `zod` schemas for tool I/O. ([GitHub][4])

### Don’t block your MCP/tool call on embeddings if you can avoid it

Node is great at orchestration, not heavy CPU:

* run extraction/embedding in a background worker (queue)
* allow eventual consistency (“memory will show up in a moment”)
* cache embeddings by hash of normalized text

### Observability is non-optional

Log per tool call:

* retrieval query → memory IDs returned → final injected context size
* write decisions (ADD/UPDATE/SUPERSEDE/NOOP) + thresholds

This is how you debug “why did the agent remember *that*?”

---

## Testing: build a “memory correctness suite”

Before you optimize:

* golden tests for dedupe (paraphrases, contradictions, updates)
* retrieval tests for “should return X, not Y”
* prompt budget tests (never exceed N tokens for memory block)

This is the difference between a demo and a reliable memory layer.

---

