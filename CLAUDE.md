# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hyper-Memory is an agentic memory framework CLI for coding agents, business agents, and personal assistants. It stores curated, queryable memories (MEMs) in a HelixDB graph database with vector search capabilities.

## Installation

```bash
npm install -g hypermem
```

## Commands

```bash
# Development
npm run start              # Run CLI via tsx
npm run build              # Compile TypeScript to dist/
npm run typecheck          # Type check without emitting
npm run seed               # Seed database with sample data

# CLI usage
hypermem add "statement"   # Add a memory
hypermem search "query"    # Vector search memories
hypermem list              # List all ACTIVE memories
hypermem list rules        # List active rules (aliases: decisions, problems, traits, etc.)
hypermem forget <id>       # Permanently delete a memory
hypermem dim <id>          # Soft delete (hide from default queries)
hypermem undim <id>        # Restore a dimmed memory
hypermem object add        # Add an object entity
hypermem context add       # Add a context
hypermem agent add         # Add an agent
hypermem link about        # Link mem to object
hypermem reality-check     # Current time and active rules
hypermem onboard           # Quick start guide for agents
```

## Required Environment Variables

- `OPENAI_API_KEY` - Required for embeddings and classification
- `HELIX_URL` - HelixDB instance URL (defaults to http://localhost:6969)

## Architecture

### Core Ontology (V1)

The system uses a graph-based ontology with these node types:

- **Mem** - Core memory unit with type (Decision, Problem, Rule, BestPractice, Convention, AntiPattern, Trait, Preference, Causal, Version), state (FACT/ASSUMPTION), confidence, and status (ACTIVE/SUPERSEDED/CONTESTED/DIMMED)
- **Object** - Things memories are about (Language, Framework, Lib, Tool, etc.)
- **Context** - Where memories apply (Org, Project)
- **Agent** - AI agent instances that propose memories
- **Trace** - Internal records (SessionLog, Event, Snapshot, CheckResult)
- **Reference** - External sources (url, doc, commit, pr, adr, ticket)

Edges connect nodes: About, InContext, ProposedByAgent, VersionOf, HasEvidence, Supersedes, Contradicts, DependsOn, HasCause, HasEffect, Related

### Key Directories

- `src/commands/` - CLI command implementations (Commander.js)
- `src/pipelines/` - Write and read pipelines that orchestrate AI + DB operations
- `src/ai/` - OpenAI integration via Vercel AI SDK (`@ai-sdk/openai`)
- `src/db/` - HelixDB client wrapper with all CRUD and graph operations
- `src/types/` - TypeScript types and Zod schemas
- `db/` - HelixQL schema (schema.hx) and queries (queries.hx)

### Data Flow

**Write Pipeline** (`src/pipelines/write.ts`):
1. Classify statement with LLM to determine mem_type/mem_state (or use provided values)
2. Validate with Zod schema
3. Generate embedding (statement + notes combined)
4. Store mem node and vector embedding in HelixDB

**Read Pipeline** (`src/pipelines/read.ts`):
1. Generate query embedding
2. Vector search MemEmbedding (fetches 2x limit for post-filtering)
3. Fetch all mems and join with vector results
4. Filter by status, sort by similarity score

### AI Models

Configure in `src/ai/client.ts`. Always validate latest versions of libraries and models:

```bash
hypermem list versions          # List active Version mems
hypermem search "GPT version"   # Search for specific library
```

## HelixDB

The project uses HelixDB (helix-ts npm package) as a graph database with vector search:

- Schema defined in `db/schema.hx` (nodes, edges, vector stores)
- Queries defined in `db/queries.hx` (HelixQL syntax)
- Client wrapper in `src/db/client.ts` handles type conversion
- Vector search returns distance scores; convert to similarity with `1 - score`

HelixDB notes:
- Use UPDATE for property changes (preserves node ID and edges)
- Use UpsertE for idempotent edge creation (avoids duplicates)
- Tags/actors stored as JSON strings, parsed on read
