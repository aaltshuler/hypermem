# Hypermem

Persistent, queryable external memory for AI coding agents.

Hypermem stores curated memories (rules, decisions, conventions, versions, preferences) in a graph database with vector search. Agents query it to stay consistent across sessions.

## Requirements

- Node.js 20+
- [HelixDB](https://helix-db.com) instance
- OpenAI API key (for embeddings)

## Installation

```bash
npm install
npm run build
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
hypermem search "state management"

# List by type
hypermem list --type Rule
hypermem list --type Version

# Add a memory
hypermem add "Use pnpm over npm" --type Convention --tags "tooling"
```

## Commands

### Memories

```bash
hypermem add <statement>     # Add a memory
hypermem search <query>      # Vector search
hypermem list                # List all (with filters)
hypermem delete <id>         # Delete by ID
hypermem validate <id>       # Mark as validated
```

### Entities

```bash
hypermem object add <name>   # Add object (Lib, Tool, Model, etc.)
hypermem context add <name>  # Add context (Project, Org)
hypermem agent add <name>    # Add agent instance
hypermem trace add <summary> # Add trace record
hypermem reference add <title>  # Add external reference
```

### Relationships

```bash
hypermem link about <memId> <objectId>      # What it's about
hypermem link context <memId> <contextId>   # Where it applies
hypermem link supersedes <new> <old>        # Replace outdated
hypermem link versionof <memId> <objectId>  # Version -> Model
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
| Rule | Must follow (constraints) |
| AntiPattern | Must avoid (learned mistakes) |
| BestPractice | Should follow (recommendations) |
| Convention | Team/project standard |
| Decision | Architecture/tech choice |
| Version | Library/model version info |
| Problem | Known issue |
| Preference | User likes/dislikes |
| Trait | User behavior patterns |
| Causal | Cause-effect relationships |

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
