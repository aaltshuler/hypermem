## Projects
1. **hyper-space** - Self-organizing outliner/knowledge graph with Neo4j
2. **hyper-signals** - Signal processing/RAG pipeline with AI
3. **hyper-x** - X/Twitter bookmarks management app
4. **slack-agent** - Slack bot for real estate analytics (MIRA)
5. **aks-platform** - Educational platform with cohort management
6. **hyper-memory** - Memory/context management system
7. **hyper-viz** - Visualization tools
8. **lbx-cms** - LBX Pro private markets platform + AGENT (Next.js + Payload CMS)
9. **lbx-pipeline** - Data pipeline for lbx-cms (BigQuery → MongoDB)
10. **hyper9-site** - HYPER9 industry intel toolkit landing + docs site
11. **aks-agent** - AI agent for AKS platform
12. **my-site** - Personal portfolio site (dark, minimalistic, Vercel-style)
13. **island-dash** - Island dashboard with Neo4j MCP integration


## Communication Style
- **Direct/Imperative** - Commands: "review", "add", "remove", "fix", "build"
- **Visual thinker** - "create ascii UI mockups", "create ascii sequence diagram"
- **Multi-line** - Combines command + context + constraints in one message
- **Blunt corrections** - "no", "not working", "wrong", "wait"
- **ALL CAPS for frustration** - "NO! Pannel select LABEL, not NODE"
- **Numbered responses** - "1 - no, 2 - separate, 3 - yes"

## Decision Making

- **Explicit preferences** - States likes/dislikes clearly
- **Questions architecture** - "how can we optimize it?"
- **Challenges assumptions** - "do we really need it?", "why are we using this?"
- **Very opinionated** - References specific libraries and approaches
- **Semantic precision** - Cares a lot about correct and precise semantics
- **Investigative**: "what creds I need to run test?"

## Values
1. **Explicit control** - Especially over architecture, components and libs
2. **Minimalistic & clean approach** - No over-engineering, simple over complex
3. **Quality** - thorough reviews, optimization, testing before commit
4. **Consistency** - Same patterns across projects
5. **Knowledge-driven** - ONTOLOGY.md, schema docs, changelogs, conventions


## NON-NEGOTIABLE RULES

1. **NEVER change LLM models unless explicitly asked**
2. **ONLY use LATEST  MODELS GPT-5.2, Claude Opus-4-5** - NEVER GPT-4, LLAMA!
3. **Python projects use Poetry** (Python 3.14)
4. **Options first, implement after** - ask before building
5. **Don't change user's text/content** without permission
6.  **DON'T BUILD AFTER EACH CHANGE** - batch changes, build at end

## Antipatterns
1. Auto-changing LLM models
2. Over-engineering
3. Using outdated approaches and libraries
4. Changing user's text/content without permission
5. Adding unnecessary features
6. Changing LLM models without asking
7. Building after each small change (wants batching)
8. Implementing when asked for options only
9. Removing UI elements without asking
10. Adding interactive popovers (wants command palette)
11. Using undocumented relations in knowledge graphs
12. Conceptual misunderstandings (label vs node)
13. Breaking basic functionality (Enter key, etc.)
14. "Duct-tape solutions" - poor implementation quality

## Best Practices
We use iterative approach: frequent review, feedback, fix cycle
Create ASCII mockups: visalize UI before implementation
Use ASCII diagrams: to visualize complex architecture and logic
For complex problems/refactoring - present options, never implement without approval
Keep code modular: unbundle and simplify
Kepp UI clean and minimalistic, remove unnecessary elements, do not overuse white space
Maintain knowledge docs: ontology.md, architecture.md, schema.md
Use Context7 MCP: for up to datedocumentation lookup
Reference ONTOLOGY.md: key app elements, concepts, vocabulary
Prefer command palette in UI (Next.js + shadcn): most actions through cmdk, not buttons
For cards view: 3-4 per line, less rounded corners, darker bg
Use slate color palette: different tones rather than different colors
Use zink color palette: different tones rather than different colors
Avoid rounded corners on tables: clean, professional look
Use tabular-nums: for numeric data alignment
Use cards for variable data: modular, handles missing fields gracefully
Prefer Vercel-style minimalism: dark bg, clean typography

## OBJECTS

### Languages
- TypeScript (primary)
- JavaScript
- Python (for backend/ML pipelines)

### Frameworks
- **Next.js** - primary web framework
- **React** - primary UI library
- **FastAPI** (Python backend)
- **TailwindCSS** (styling)
- **Payload CMS** (headless CMS for content management)
- **Fumadocs** (documentation sites)

## Workflows and pipelines
- Vercel Workflows (for async jobs)
- Prefect (for data pipelines)

### State & Data Management
- **Zustand** (preferred for React state)
- TanStack Query / React Query (server state)

### UI Components
- **shadcn/ui** (primary component library)
- **Radix UI** (primitives)
- **dnd-kit** (drag and drop)
- **Tiptap** (rich text editor)
- Command palette (shadcn)
- **Recharts** (charts and data visualization)
- **D3** (for simple charts)
- **Framer Motion** (animations, highlight effects)
- **Embla Carousel** (carousels with autoplay)
- **Carbon Icons** / **Carbon Pictograms** (icon library)
- **Streamdown** (AI chat markdown rendering)
- **AI Elements (Vercel)**
- **INK** (Typescript CLI UI framework)
- **Typer** (Python CLI framework)

### Fonts (Preferred)
- **Allience** - headers alternative
- **Urbanist** - headers, clean modern
- **Geist Sans** - headers alternative
- **Geist Mono** - monospace, code
- **Berkeley** - body text
- **JetBrains Mono** - monospace alternative

### Databases
- **MongoDB** (primary, with Atlas Vector Search)
- **Neo4j** (graph database)
- **HelixDB** (graph-vector database)
- **Redis** / **Upstash Redis** (caching, rate limiting)
- Supabase, PlanetScale, Neon - PostgreSQL

### AI
- **OpenAI GPT-5.x series** (gpt-5.2, gpt-5-nano)
- **Claude** (claude-opus-4-5-20251101, claude-sonnet-4-5-20250929, claude-haiku)
- **Vercel AI SDK 6** (typescript SDK)
- **Mastra** (Typescript agent framework)
- **pydantic-ai** (Python agent framework)
- OpenAI embeddings (text-embedding-3-small, text-embedding-3-large)
- **Langfuse** (LLM observability/tracing)
- **Anthropic SDK** (direct Claude integration)
- **Google ADK** (google agent framework)

### Auth
- **Clerk** (primary auth provider)

### Build/Package
- npm (Node.js)
- Poetry (Python)
- pnpm (for Payload CMS)
- Vercel (deployment)
- QStash (job queuing)
- ngrok (local tunneling for agents)
- Docker (containerization)

### Testing
- Jest
- Playwright