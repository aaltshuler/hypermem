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
// CONTEXTS (Example Projects)
// ============================================

const contexts: { name: string; type: ContextType; description: string }[] = [
  { name: 'ai-chat', type: 'Project', description: 'AI chat application with streaming responses' },
  { name: 'task-dashboard', type: 'Project', description: 'Task management dashboard with real-time updates' },
];

// ============================================
// OBJECTS
// ============================================

const objects: { name: string; type: ObjectType; description: string }[] = [
  // Languages (2)
  { name: 'TypeScript', type: 'Language', description: 'Typed JavaScript superset' },
  { name: 'Python', type: 'Language', description: 'General-purpose programming language' },

  // Databases (5)
  { name: 'MongoDB', type: 'Database', description: 'Document database with vector search' },
  { name: 'HelixDB', type: 'Database', description: 'Graph-vector database' },
  { name: 'Redis', type: 'Database', description: 'In-memory key-value store' },
  { name: 'Supabase', type: 'Database', description: 'PostgreSQL hosting platform' },
  { name: 'Neon', type: 'Database', description: 'Serverless PostgreSQL' },

  // Frameworks (4)
  { name: 'Next.js', type: 'Framework', description: 'React meta-framework with SSR/SSG' },
  { name: 'React', type: 'Framework', description: 'JavaScript UI library' },
  { name: 'FastAPI', type: 'Framework', description: 'Python async web framework' },
  { name: 'TailwindCSS', type: 'Framework', description: 'Utility-first CSS framework' },

  // Libs (5)
  { name: 'Zustand', type: 'Lib', description: 'Minimal React state management' },
  { name: 'TanStack Query', type: 'Lib', description: 'Async state management for React' },
  { name: 'shadcn/ui', type: 'Lib', description: 'Radix-based component collection' },
  { name: 'Radix UI', type: 'Lib', description: 'Unstyled accessible UI primitives' },
  { name: 'Framer Motion', type: 'Lib', description: 'React animation library' },

  // Models (3)
  { name: 'GPT', type: 'Model', description: 'OpenAI language model' },
  { name: 'Claude Opus', type: 'Model', description: 'Anthropic flagship model' },
  { name: 'Claude Sonnet', type: 'Model', description: 'Anthropic mid-tier model' },

  // APIs (2)
  { name: 'Vercel AI SDK', type: 'API', description: 'TypeScript SDK for AI applications' },
  { name: 'Anthropic SDK', type: 'API', description: 'Official Claude API client' },

  // Tools (5)
  { name: 'npm', type: 'Tool', description: 'Node.js package manager' },
  { name: 'pnpm', type: 'Tool', description: 'Fast disk-efficient package manager' },
  { name: 'Docker', type: 'Tool', description: 'Container runtime' },
  { name: 'Jest', type: 'Tool', description: 'JavaScript testing framework' },
  { name: 'Playwright', type: 'Tool', description: 'Browser automation framework' },

  // Fonts (3)
  { name: 'Geist Sans', type: 'Font', description: 'Vercel sans-serif typeface' },
  { name: 'Geist Mono', type: 'Font', description: 'Vercel monospace typeface' },
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
  notes?: string;
  actors: ActorType[];
  linkTo?: string[];
}

const mems: MemData[] = [
  // Rules (2)
  { statement: 'Options first, implement after - ask before building', type: 'Rule', state: 'FACT', actors: ['human'] },
  { statement: 'Do not change user text/content without permission', type: 'Rule', state: 'FACT', actors: ['human'] },

  // AntiPatterns (4)
  { statement: 'Over-engineering solutions', type: 'AntiPattern', state: 'FACT', actors: ['human'] },
  { statement: 'Using outdated approaches and libraries', type: 'AntiPattern', state: 'FACT', actors: ['human'] },
  { statement: 'Adding unnecessary features', type: 'AntiPattern', state: 'FACT', actors: ['human'] },
  { statement: 'Duct-tape solutions - poor implementation quality', type: 'AntiPattern', state: 'FACT', actors: ['human'] },

  // BestPractices (4)
  { statement: 'Use iterative approach: frequent review, feedback, fix cycle', type: 'BestPractice', state: 'FACT', actors: ['human'] },
  { statement: 'Keep code modular: unbundle and simplify', type: 'BestPractice', state: 'FACT', actors: ['human'] },
  { statement: 'For complex problems/refactoring - present options, never implement without approval', type: 'BestPractice', state: 'FACT', actors: ['human'] },
  { statement: 'Use Zustand for React state management', type: 'BestPractice', state: 'FACT', actors: ['human'], linkTo: ['Zustand', 'React'] },

  // Preferences (2)
  {
    statement: 'Prefers ASCII mockups to visualize UI before implementation',
    type: 'Preference',
    state: 'FACT',
    title: 'UI Visualization',
    notes: 'Wants to see the layout visually before any code is written. Reduces misunderstandings and rework.',
    actors: ['human'],
  },
  {
    statement: 'Prefers clean and minimalistic UI solutions over bloated ones',
    type: 'Preference',
    state: 'FACT',
    title: 'Minimalist Design',
    notes: 'Questions every addition. Less is more.',
    actors: ['human'],
  },

  // Traits (2)
  {
    statement: 'Asks detailed questions to understand system state before acting',
    type: 'Trait',
    state: 'FACT',
    title: 'Investigative',
    notes: 'Needs full context before proceeding. Asks "which fields are mandatory?", "where do we get this data?".',
    actors: ['human'],
  },
  {
    statement: 'Cares deeply about correct terminology and precise meaning',
    type: 'Trait',
    state: 'FACT',
    title: 'Semantic Precision',
    notes: 'Corrects conceptual misunderstandings immediately. Insists on proper naming.',
    actors: ['human'],
  },
];

// Version Mems (linked to Model objects)
interface VersionMemData {
  title: string;
  statement: string;
  modelName: string;
}

const versionMems: VersionMemData[] = [
  { title: '5.2 (gpt-5.2-2025-12-11)', statement: 'Latest version, stable', modelName: 'GPT' },
  { title: '4.5 (claude-opus-4-5-20251101)', statement: 'Current release', modelName: 'Claude Opus' },
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
    const textToEmbed = mem.notes ? `${mem.statement}\n\n${mem.notes}` : mem.statement;
    const embedding = await generateEmbedding(textToEmbed);

    const result = await addMem(client, {
      mem_type: mem.type,
      mem_state: mem.state,
      statement: mem.statement,
      status: 'ACTIVE',
      title: mem.title,
      notes: mem.notes,
      actors: mem.actors,
      created_at: now,
    });

    await addMemEmbedding(client, result.id, result.status, now, embedding);

    console.log(`  [${mem.type}] ${mem.statement.slice(0, 50)}... -> ${result.id}`);

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
    const embedding = await generateEmbedding(`${ver.title} ${ver.statement}`);

    const result = await addMem(client, {
      mem_type: 'Version',
      mem_state: 'FACT',
      statement: ver.statement,
      status: 'ACTIVE',
      title: ver.title,
      actors: ['human'],
      created_at: now,
    });

    await addMemEmbedding(client, result.id, result.status, now, embedding);

    console.log(`  [Version] ${ver.title} -> ${result.id}`);

    const model = await getObjectByName(client, ver.modelName);
    if (model) {
      await linkVersionOf(client, result.id, model.id);
      console.log(`    -> VersionOf ${ver.modelName}`);
    }
  }
}

async function main() {
  console.log('Starting example seed...\n');

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
    console.log(`  Total: ${contexts.length + objects.length + mems.length + versionMems.length}`);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

main();
