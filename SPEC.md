# HYPER-MEMORY

Agentic memory framework for coding agents, business agents, and personal assistants.

---

## Ontology

### Entities

CONTEXT
  Project
  Person
  Org

IDENTITY
  Trait
  Style
  Strength
  Preference

KNOWLEDGE
  Fact
  Know-how
  Best-practice
  Reference

OPS
  Template
  Tool
  Lib
  Stack

CONVENTION

PATTERN
ANTIPATTERN

RULE
ASSUMPTION
DECISION
CAUSE

### Relations


SUPERSEDES       Newer version of a fact
CONTRADICTS      Conflicts with another fact
SUPPORTS         Evidence for another fact
DEPENDS_ON       Prerequisite relationship
CAUSED_BY        Causal chain
CAUSES           Effect relationship
BLOCKED_BY       Impediment
ABOUT            Links atom to context
FROM_SOURCE      Provenance link
AUTHORED_BY      Creator link
RELATED          General association

---

## Entities

| Entity | Purpose |
|--------|---------|
| **MemoryAtom** | Single atomic claim with type, content, embedding, importance, confidence |
| **Context** | Project / Person / Org / Domain / Topic |
| **Actor** | User / Agent / System |
| **Source** | Chat / Email / Doc / Web / Note — provenance |

---

## Activities

### Write Activities

| Activity | Description |
|----------|-------------|
| **Classify** | Determine if input is memory-worthy and what type |
| **Extract** | Split into atomic single-claim statements |
| **Normalize** | Canonical names, units, entity resolution |
| **Dedupe** | Exact match + embedding similarity → UPDATE / SUPERSEDE / NOOP |
| **Link** | Attach provenance (source, actor, timestamp) |
| **Embed** | Generate and store vector |

### Read Activities

| Activity | Description |
|----------|-------------|
| **Search** | Vector search for top-K candidates |
| **Expand** | Graph traversal for connected contexts and related atoms |
| **Rerank** | Score by similarity × recency × importance × edge weight |
| **Compress** | Token-budgeted minimal context output |

### Active Memory Activities

| Activity | Description |
|----------|-------------|
| **Discover** | Find implicit patterns, connections, clusters in existing atoms |
| **Enrich** | Add missing metadata, strengthen weak links, infer categories |
| **Validate** | Check for stale facts, outdated preferences, broken references |
| **Cleanup** | Expire low-importance atoms, merge near-duplicates, prune orphans |
| **Consolidate** | Roll up granular facts into higher-level patterns/summaries |
| **Verify** | Prompt user to confirm uncertain or conflicting atoms |

### Lifecycle Activities

| Activity | Description |
|----------|-------------|
| **Forget** | User-initiated deletion of specific atoms |
| **Redact** | PII removal, sensitive data scrubbing |
| **Expire** | Time-based or importance-based auto-removal |
| **Audit** | Log why a memory was returned, what influenced a decision |

---

## Example Data

### Identity

```yaml
- type: Preference
  content: "Dark aesthetic (Ayu-dark theme)"
  importance: 0.8

- type: Preference
  content: "Visual precision - specific colors (#0b0e14), no gaps"
  importance: 0.9

- type: Preference
  content: "Concise communication - short, direct, no over-explanation"
  importance: 0.9

- type: Trait
  content: "Core expertise: data analysis, data engineering, data science"
  importance: 1.0

- type: Trait
  content: "Perfectionist, control-oriented"
  importance: 0.7
```

### Patterns

```yaml
- type: Pattern
  content: "DO NOT BUILD after each small change - batch operations"
  importance: 1.0

- type: Pattern
  content: "Figure out first, then build - no premature implementation"
  importance: 0.9

- type: Pattern
  content: "Iterative refinement - small tweaks, see result, repeat"
  importance: 0.8

- type: Antipattern
  content: "Over-engineering, unnecessary features"
  importance: 0.9
```

### Knowledge

```yaml
- type: Fact
  content: "Uses Groq for fast inference"
  importance: 0.7

- type: Preference
  content: "GPT-5.2 only for production, never older models"
  importance: 1.0

- type: Preference
  content: "Opus 4.5 for specific reasoning tasks"
  importance: 0.8
```

### Libs (TS)

```yaml
- type: Lib
  content: "Zod"
  context: "Validation"
  importance: 0.9

- type: Lib
  content: "Zustand"
  context: "State management"
  importance: 0.9

- type: Lib
  content: "TanStack Query"
  context: "Data fetching"
  importance: 0.9

- type: Lib
  content: "Jest"
  context: "Testing"
  importance: 0.8

- type: Lib
  content: "Ink"
  context: "CLI framework"
  importance: 0.7
```

### Libs (Python)

```yaml
- type: Lib
  content: "Pydantic"
  context: "Validation"
  importance: 0.9

- type: Lib
  content: "FastAPI"
  context: "API framework"
  importance: 0.9

- type: Lib
  content: "Structlog"
  context: "Logging"
  importance: 0.8
```

### Tools

```yaml
- type: Tool
  content: "HelixDB"
  context: "Graph database, primary"
  importance: 1.0

- type: Tool
  content: "Neo4j"
  context: "Graph database, secondary"
  importance: 0.7

- type: Tool
  content: "MongoDB"
  context: "Document store"
  importance: 0.7

- type: Tool
  content: "Redis"
  context: "Cache"
  importance: 0.8

- type: Tool
  content: "Supabase"
  context: "SQL, Blob storage"
  importance: 0.8

- type: Tool
  content: "Clerk"
  context: "Auth"
  importance: 0.8

- type: Tool
  content: "Groq"
  context: "Fast inference"
  importance: 0.8
```

### UI

```yaml
- type: Lib
  content: "shadcn"
  context: "UI components"
  importance: 0.9

- type: Lib
  content: "Carbon Icons"
  context: "Icon set"
  importance: 0.7
```

---

## Principles

1. **Atomic** — Single claim per memory
2. **Provenance** — Always know where it came from
3. **Updateable** — Supersede, don't duplicate
4. **Active** — Memory maintains itself
5. **Observable** — Log every retrieval and mutation

