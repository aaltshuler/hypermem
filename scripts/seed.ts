import 'dotenv/config';
import {
  getHelixClient,
  addContext,
  addObject,
  addMem,
  addMemEmbedding,
  linkAbout,
  linkVersionOf,
  getObjectByName,
} from '../src/db/client.js';
import { generateEmbedding } from '../src/ai/embed.js';
import type { ContextType, ObjectType, MemType, MemState, ActorType } from '../src/types/index.js';

const client = getHelixClient();

// ============================================
// CONTEXTS (Projects)
// ============================================

const contexts: { name: string; type: ContextType; description: string }[] = [
  { name: 'hyper-space', type: 'Project', description: 'Self-organizing outliner/knowledge graph with Neo4j' },
  { name: 'hyper-signals', type: 'Project', description: 'Signal processing/RAG pipeline with AI' },
  { name: 'hyper-x', type: 'Project', description: 'X/Twitter bookmarks management app' },
  { name: 'slack-agent', type: 'Project', description: 'Slack bot for real estate analytics (MIRA)' },
  { name: 'aks-platform', type: 'Project', description: 'Educational platform with cohort management' },
  { name: 'hyper-memory', type: 'Project', description: 'Memory/context management system' },
  { name: 'hyper-viz', type: 'Project', description: 'Visualization tools' },
  { name: 'lbx-cms', type: 'Project', description: 'LBX Pro private markets platform + AGENT' },
  { name: 'lbx-pipeline', type: 'Project', description: 'Data pipeline (BigQuery to MongoDB)' },
  { name: 'hyper9-site', type: 'Project', description: 'HYPER9 industry intel toolkit landing + docs' },
  { name: 'aks-agent', type: 'Project', description: 'AI agent for AKS platform' },
  { name: 'my-site', type: 'Project', description: 'Personal portfolio site' },
  { name: 'island-dash', type: 'Project', description: 'Island dashboard with Neo4j MCP integration' },
];

// ============================================
// OBJECTS
// ============================================

const objects: { name: string; type: ObjectType; description: string }[] = [
  // Languages (3)
  { name: 'TypeScript', type: 'Language', description: 'Typed JavaScript superset' },
  { name: 'JavaScript', type: 'Language', description: 'Web scripting language' },
  { name: 'Python', type: 'Language', description: 'General-purpose programming language' },

  // Databases (8)
  { name: 'MongoDB', type: 'Database', description: 'Document database with vector search' },
  { name: 'Neo4j', type: 'Database', description: 'Graph database' },
  { name: 'HelixDB', type: 'Database', description: 'Graph-vector database' },
  { name: 'Redis', type: 'Database', description: 'In-memory key-value store' },
  { name: 'Upstash Redis', type: 'Database', description: 'Serverless Redis service' },
  { name: 'Supabase', type: 'Database', description: 'PostgreSQL hosting platform' },
  { name: 'PlanetScale', type: 'Database', description: 'MySQL-compatible serverless database' },
  { name: 'Neon', type: 'Database', description: 'Serverless PostgreSQL' },

  // Frameworks (6)
  { name: 'Next.js', type: 'Framework', description: 'React meta-framework with SSR/SSG' },
  { name: 'React', type: 'Framework', description: 'JavaScript UI library' },
  { name: 'FastAPI', type: 'Framework', description: 'Python async web framework' },
  { name: 'TailwindCSS', type: 'Framework', description: 'Utility-first CSS framework' },
  { name: 'Payload CMS', type: 'Framework', description: 'Headless CMS with TypeScript' },
  { name: 'Fumadocs', type: 'Framework', description: 'Documentation framework for Next.js' },

  // Libs (18)
  { name: 'Zustand', type: 'Lib', description: 'Minimal React state management' },
  { name: 'TanStack Query', type: 'Lib', description: 'Async state management for React' },
  { name: 'shadcn/ui', type: 'Lib', description: 'Radix-based component collection' },
  { name: 'Radix UI', type: 'Lib', description: 'Unstyled accessible UI primitives' },
  { name: 'dnd-kit', type: 'Lib', description: 'Drag and drop toolkit for React' },
  { name: 'Tiptap', type: 'Lib', description: 'Headless rich text editor' },
  { name: 'Recharts', type: 'Lib', description: 'React charting library' },
  { name: 'D3', type: 'Lib', description: 'Data visualization library' },
  { name: 'Framer Motion', type: 'Lib', description: 'React animation library' },
  { name: 'Embla Carousel', type: 'Lib', description: 'Lightweight carousel library' },
  { name: 'Carbon Icons', type: 'Lib', description: 'IBM icon library' },
  { name: 'Carbon Pictograms', type: 'Lib', description: 'IBM pictogram library' },
  { name: 'Streamdown', type: 'Lib', description: 'Streaming markdown renderer' },
  { name: 'AI Elements', type: 'Lib', description: 'Vercel AI-focused UI components' },
  { name: 'INK', type: 'Lib', description: 'React-based CLI framework' },
  { name: 'Typer', type: 'Lib', description: 'Python CLI framework' },
  { name: 'Vercel Workflows', type: 'Lib', description: 'Durable async execution' },
  { name: 'Prefect', type: 'Lib', description: 'Python workflow orchestration' },

  // Models (4)
  { name: 'GPT', type: 'Model', description: 'OpenAI language model' },
  { name: 'Claude Opus', type: 'Model', description: 'Anthropic flagship model' },
  { name: 'Claude Sonnet', type: 'Model', description: 'Anthropic mid-tier model' },
  { name: 'Claude Haiku', type: 'Model', description: 'Anthropic fast model' },

  // APIs (7)
  { name: 'Vercel AI SDK', type: 'API', description: 'TypeScript SDK for AI applications' },
  { name: 'Mastra', type: 'API', description: 'TypeScript agent framework' },
  { name: 'pydantic-ai', type: 'API', description: 'Python agent framework with validation' },
  { name: 'Langfuse', type: 'API', description: 'LLM observability platform' },
  { name: 'Anthropic SDK', type: 'API', description: 'Official Claude API client' },
  { name: 'Google ADK', type: 'API', description: 'Google agent development kit' },
  { name: 'Clerk', type: 'API', description: 'Authentication and user management' },

  // Tools (9)
  { name: 'npm', type: 'Tool', description: 'Node.js package manager' },
  { name: 'Poetry', type: 'Tool', description: 'Python dependency management' },
  { name: 'pnpm', type: 'Tool', description: 'Fast disk-efficient package manager' },
  { name: 'Vercel', type: 'Tool', description: 'Frontend deployment platform' },
  { name: 'QStash', type: 'Tool', description: 'Serverless message queue' },
  { name: 'ngrok', type: 'Tool', description: 'Localhost tunneling service' },
  { name: 'Docker', type: 'Tool', description: 'Container runtime' },
  { name: 'Jest', type: 'Tool', description: 'JavaScript testing framework' },
  { name: 'Playwright', type: 'Tool', description: 'Browser automation framework' },

  // Fonts (6)
  { name: 'Allience', type: 'Font', description: 'Geometric sans-serif typeface' },
  { name: 'Urbanist', type: 'Font', description: 'Low-contrast geometric sans' },
  { name: 'Geist Sans', type: 'Font', description: 'Vercel sans-serif typeface' },
  { name: 'Geist Mono', type: 'Font', description: 'Vercel monospace typeface' },
  { name: 'Berkeley', type: 'Font', description: 'Monospace typeface' },
  { name: 'JetBrains Mono', type: 'Font', description: 'Developer-focused monospace' },
];

// ============================================
// MEMS
// ============================================

interface MemData {
  statement: string;
  type: MemType;
  state: MemState;
  title?: string;
  actors: ActorType[];
  linkTo?: string[]; // Object names to link via About
}

const mems: MemData[] = [
  // Rules (6)
  { statement: 'Never change LLM models unless explicitly asked', type: 'Rule', state: 'FACT', actors: ['human'] },
  { statement: 'Only use latest models GPT-5.2, Claude Opus 4.5 - never GPT-4, LLAMA', type: 'Rule', state: 'FACT', actors: ['human'], linkTo: ['GPT', 'Claude Opus'] },
  { statement: 'Python projects use Poetry (Python 3.14)', type: 'Rule', state: 'FACT', actors: ['human'], linkTo: ['Python', 'Poetry'] },
  { statement: 'Options first, implement after - ask before building', type: 'Rule', state: 'FACT', actors: ['human'] },
  { statement: 'Do not change user text/content without permission', type: 'Rule', state: 'FACT', actors: ['human'] },
  { statement: 'Do not build after each change - batch changes, build at end', type: 'Rule', state: 'FACT', actors: ['human'] },

  // AntiPatterns (14)
  { statement: 'Auto-changing LLM models without asking', type: 'AntiPattern', state: 'FACT', actors: ['human'] },
  { statement: 'Over-engineering solutions', type: 'AntiPattern', state: 'FACT', actors: ['human'] },
  { statement: 'Using outdated approaches and libraries', type: 'AntiPattern', state: 'FACT', actors: ['human'] },
  { statement: 'Changing user text/content without permission', type: 'AntiPattern', state: 'FACT', actors: ['human'] },
  { statement: 'Adding unnecessary features', type: 'AntiPattern', state: 'FACT', actors: ['human'] },
  { statement: 'Changing LLM models without asking', type: 'AntiPattern', state: 'FACT', actors: ['human'] },
  { statement: 'Building after each small change instead of batching', type: 'AntiPattern', state: 'FACT', actors: ['human'] },
  { statement: 'Implementing when asked for options only', type: 'AntiPattern', state: 'FACT', actors: ['human'] },
  { statement: 'Removing UI elements without asking', type: 'AntiPattern', state: 'FACT', actors: ['human'] },
  { statement: 'Adding interactive popovers instead of command palette', type: 'AntiPattern', state: 'FACT', actors: ['human'] },
  { statement: 'Using undocumented relations in knowledge graphs', type: 'AntiPattern', state: 'FACT', actors: ['human'] },
  { statement: 'Conceptual misunderstandings (label vs node)', type: 'AntiPattern', state: 'FACT', actors: ['human'] },
  { statement: 'Breaking basic functionality (Enter key, etc.)', type: 'AntiPattern', state: 'FACT', actors: ['human'] },
  { statement: 'Duct-tape solutions - poor implementation quality', type: 'AntiPattern', state: 'FACT', actors: ['human'] },

  // BestPractices (17)
  { statement: 'Use iterative approach: frequent review, feedback, fix cycle', type: 'BestPractice', state: 'FACT', actors: ['human'] },
  { statement: 'Create ASCII mockups to visualize UI before implementation', type: 'BestPractice', state: 'FACT', actors: ['human'] },
  { statement: 'Use ASCII diagrams to visualize complex architecture and logic', type: 'BestPractice', state: 'FACT', actors: ['human'] },
  { statement: 'For complex problems/refactoring - present options, never implement without approval', type: 'BestPractice', state: 'FACT', actors: ['human'] },
  { statement: 'Keep code modular: unbundle and simplify', type: 'BestPractice', state: 'FACT', actors: ['human'] },
  { statement: 'Keep UI clean and minimalistic, remove unnecessary elements', type: 'BestPractice', state: 'FACT', actors: ['human'] },
  { statement: 'Maintain knowledge docs: ontology.md, architecture.md, schema.md', type: 'BestPractice', state: 'FACT', actors: ['human'] },
  { statement: 'Use Context7 MCP for up to date documentation lookup', type: 'BestPractice', state: 'FACT', actors: ['human'] },
  { statement: 'Reference ONTOLOGY.md for key app elements, concepts, vocabulary', type: 'BestPractice', state: 'FACT', actors: ['human'] },
  { statement: 'Prefer command palette in UI (Next.js + shadcn): most actions through cmdk', type: 'BestPractice', state: 'FACT', actors: ['human'], linkTo: ['Next.js', 'shadcn/ui'] },
  { statement: 'For cards view: 3-4 per line, less rounded corners, darker bg', type: 'BestPractice', state: 'FACT', actors: ['human'] },
  { statement: 'Use slate/zinc color palette: different tones rather than different colors', type: 'BestPractice', state: 'FACT', actors: ['human'] },
  { statement: 'Avoid rounded corners on tables: clean, professional look', type: 'BestPractice', state: 'FACT', actors: ['human'] },
  { statement: 'Use tabular-nums for numeric data alignment', type: 'BestPractice', state: 'FACT', actors: ['human'] },
  { statement: 'Use cards for variable data: modular, handles missing fields gracefully', type: 'BestPractice', state: 'FACT', actors: ['human'] },
  { statement: 'Prefer Vercel-style minimalism: dark bg, clean typography', type: 'BestPractice', state: 'FACT', actors: ['human'], linkTo: ['Vercel'] },
  { statement: 'Use Zustand for React state management', type: 'BestPractice', state: 'FACT', actors: ['human'], linkTo: ['Zustand', 'React'] },

  // Traits (12)
  { statement: 'Direct/Imperative communication - Commands: review, add, remove, fix, build', type: 'Trait', state: 'FACT', actors: ['human'] },
  { statement: 'Visual thinker - prefers ASCII mockups and sequence diagrams', type: 'Trait', state: 'FACT', actors: ['human'] },
  { statement: 'Multi-line messages - Combines command + context + constraints in one message', type: 'Trait', state: 'FACT', actors: ['human'] },
  { statement: 'Blunt corrections - no, not working, wrong, wait', type: 'Trait', state: 'FACT', actors: ['human'] },
  { statement: 'ALL CAPS for frustration emphasis', type: 'Trait', state: 'FACT', actors: ['human'] },
  { statement: 'Numbered responses - 1 - no, 2 - separate, 3 - yes', type: 'Trait', state: 'FACT', actors: ['human'] },
  { statement: 'Explicit preferences - States likes/dislikes clearly', type: 'Trait', state: 'FACT', actors: ['human'] },
  { statement: 'Questions architecture - how can we optimize it?', type: 'Trait', state: 'FACT', actors: ['human'] },
  { statement: 'Challenges assumptions - do we really need it?, why are we using this?', type: 'Trait', state: 'FACT', actors: ['human'] },
  { statement: 'Very opinionated - References specific libraries and approaches', type: 'Trait', state: 'FACT', actors: ['human'] },
  { statement: 'Semantic precision - Cares about correct and precise semantics', type: 'Trait', state: 'FACT', actors: ['human'] },
  { statement: 'Investigative - what creds I need to run test?', type: 'Trait', state: 'FACT', actors: ['human'] },

  // Preferences (5)
  { statement: 'Explicit control - Especially over architecture, components and libs', type: 'Preference', state: 'FACT', actors: ['human'] },
  { statement: 'Minimalistic & clean approach - No over-engineering, simple over complex', type: 'Preference', state: 'FACT', actors: ['human'] },
  { statement: 'Quality - thorough reviews, optimization, testing before commit', type: 'Preference', state: 'FACT', actors: ['human'] },
  { statement: 'Consistency - Same patterns across projects', type: 'Preference', state: 'FACT', actors: ['human'] },
  { statement: 'Knowledge-driven - ONTOLOGY.md, schema docs, changelogs, conventions', type: 'Preference', state: 'FACT', actors: ['human'] },
];

// Version Mems (linked to Model objects)
interface VersionMemData {
  title: string;
  statement: string;
  modelName: string;
}

const versionMems: VersionMemData[] = [
  { title: '5.2 (gpt-5.2-2025-12-11)', statement: 'Latest version, stable', modelName: 'GPT' },
  { title: '5-nano (gpt-5-nano)', statement: 'Latest version of cheapest model', modelName: 'GPT' },
  { title: '4.5 (claude-opus-4-5-20251101)', statement: 'Current release', modelName: 'Claude Opus' },
  { title: '4.5 (claude-sonnet-4-5-20250929)', statement: 'Current release', modelName: 'Claude Sonnet' },
];

// ============================================
// SEED FUNCTIONS
// ============================================

async function seedContexts() {
  console.log('\n=== Seeding Contexts ===');
  for (const ctx of contexts) {
    const result = await addContext(client, {
      context_type: ctx.type,
      name: ctx.name,
      description: ctx.description,
    });
    console.log(`  [${ctx.type}] ${ctx.name} -> ${result.id}`);
  }
}

async function seedObjects() {
  console.log('\n=== Seeding Objects ===');
  for (const obj of objects) {
    const result = await addObject(client, {
      object_type: obj.type,
      name: obj.name,
      description: obj.description,
    });
    console.log(`  [${obj.type}] ${obj.name} -> ${result.id}`);
  }
}

async function seedMems() {
  console.log('\n=== Seeding Mems ===');
  const now = new Date().toISOString();

  for (const mem of mems) {
    // Generate embedding
    const embedding = await generateEmbedding(mem.statement);

    // Add mem
    const result = await addMem(client, {
      mem_type: mem.type,
      mem_state: mem.state,
      statement: mem.statement,
      status: 'ACTIVE',
      title: mem.title,
      actors: mem.actors,
      created_at: now,
    });

    // Add embedding
    await addMemEmbedding(client, result.id, result.status, now, embedding);

    console.log(`  [${mem.type}] ${mem.statement.slice(0, 50)}... -> ${result.id}`);

    // Link to objects if specified
    if (mem.linkTo) {
      for (const objName of mem.linkTo) {
        const obj = await getObjectByName(client, objName);
        if (obj) {
          await linkAbout(client, result.id, obj.id);
          console.log(`    -> Linked to ${objName}`);
        }
      }
    }
  }
}

async function seedVersionMems() {
  console.log('\n=== Seeding Version Mems ===');
  const now = new Date().toISOString();

  for (const ver of versionMems) {
    // Generate embedding from title + statement
    const embedding = await generateEmbedding(`${ver.title} ${ver.statement}`);

    // Add mem
    const result = await addMem(client, {
      mem_type: 'Version',
      mem_state: 'FACT',
      statement: ver.statement,
      status: 'ACTIVE',
      title: ver.title,
      actors: ['human'],
      created_at: now,
    });

    // Add embedding
    await addMemEmbedding(client, result.id, result.status, now, embedding);

    console.log(`  [Version] ${ver.title} -> ${result.id}`);

    // Link to model object
    const model = await getObjectByName(client, ver.modelName);
    if (model) {
      await linkVersionOf(client, result.id, model.id);
      console.log(`    -> VersionOf ${ver.modelName}`);
    }
  }
}

async function main() {
  console.log('Starting seed...\n');

  try {
    await seedContexts();
    await seedObjects();
    await seedMems();
    await seedVersionMems();

    console.log('\n=== Seed Complete ===');
    console.log(`  Contexts: ${contexts.length}`);
    console.log(`  Objects: ${objects.length}`);
    console.log(`  Mems: ${mems.length}`);
    console.log(`  Versions: ${versionMems.length}`);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

main();
