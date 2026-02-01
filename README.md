# Hypermem

Living memory for AI agents.

Opinionated memory framework designed for active curation and hydration over time.

## Principles

**Memory is a signal vs noise problem.**
Not everything deserves to be remembered. Hypermem stores curated, high-value memories - rules, decisions, conventions, versions, preferences - not raw logs or conversation dumps.

**Graphs allow agents to reason through memory.**
Memories connect to objects, contexts, and each other. Agents traverse relationships to understand why decisions were made, what superseded what, and how things relate.

**Memory needs to be hydrated and pollinated.**
Stale memory is dead memory. Hypermem validates facts, hydrates assumptions, notices contradictions, and evolves memory via append-only updates.

## Requirements

- Node.js 20+
- [HelixDB](https://helix-db.com) instance
- OpenAI API key (for embeddings)

## Installation

```bash
npm install -g hypermem
```

## Configuration

```bash
export OPENAI_API_KEY="sk-..."
export HELIX_URL="http://localhost:6969"  # optional, defaults to this
```

## Quick Start

```bash
# Deploy HelixDB schema
helix push dev

# Seed example data
npx tsx scripts/seed-examples.ts

# Run onboarding
hypermem onboard

# Search memories
hypermem search "GPT"              # Text search (fast)
hypermem vsearch "state management" # Vector search (semantic)

# List by type (using aliases)
hypermem list rules
hypermem list versions
hypermem list lexicons

# Add a memory
hypermem add "Use pnpm over npm" --type rule --tags "tooling"
hypermem add "Batch changes, build at end" --type rule --reality-check
```

## Commands

### Memories

```bash
hypermem add <statement>     # Add a memory
hypermem search <query>      # Text search (fast, substring match)
hypermem vsearch <query>     # Vector search (semantic similarity)
hypermem list                # List ACTIVE memories
hypermem list rules          # Aliases: decisions, problems, traits, lexicons, versions
hypermem forget <id>         # Permanently delete
hypermem dim <id>            # Soft delete (hide from default queries)
hypermem undim <id>          # Restore a dimmed memory
hypermem validate <id>       # Mark as validated
```

### Entities

```bash
hypermem object add <name>   # Add object (Lib, Tool, LLM, etc.)
hypermem context add <name>  # Add context (Project, Org, Domain, Stage)
hypermem agent add <name>    # Add agent instance
hypermem trace add <summary> # Add trace record
hypermem reference add <title>  # Add external reference
```

### Relationships

```bash
hypermem link about <memId> <objectId>      # What it's about
hypermem link context <memId> <contextId>   # Where it applies
hypermem link supersedes <new> <old>        # Replace outdated
hypermem link versionof <memId> <objectId>  # Version -> LLM
hypermem link partof <objectId> <contextId> # Object -> Domain
```

### Utilities

```bash
hypermem onboard        # Agent quick start guide
hypermem reality-check  # Current time + active rules
hypermem --help         # Full command list
```

## Memory Types

| Type | Purpose |
|------|---------|
| Rule | Must follow (constraints, things to avoid) |
| BestPractice | Should follow (recommendations) |
| Decision | Architecture/tech choice |
| Problem | Known issue |
| Lexicon | High-bandwidth shorthand vocabulary |
| Trait | User behavior patterns |
| Version | Library/model version info |

## Architecture

```
src/
  commands/     # CLI commands (Commander.js)
  pipelines/    # Write/read pipelines
  ai/           # OpenAI embeddings
  db/           # HelixDB client
  types/        # TypeScript types + Zod schemas

db/
  schema.hx     # HelixDB schema
  queries.hx    # HelixQL queries
```

## Development

```bash
npm run start      # Run via tsx
npm run build      # Compile TypeScript
npm run typecheck  # Type check only
```

## License

MIT
