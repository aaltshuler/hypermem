import 'dotenv/config';
import {
  getHelixClient,
  addContext,
  addObject,
  addMem,
  addMemEmbedding,
  linkAbout,
  linkInContext,
  linkVersionOf,
  linkPartOf,
  getObjectByName,
  getContextByName,
} from '../src/db/client.js';
import { generateEmbedding } from '../src/ai/embed.js';
import type { ContextType, ObjectType, MemType, MemState } from '../src/types/index.js';

const client = getHelixClient();

// ============================================
// CONTEXTS (Example Projects)
// ============================================

const contexts: { name: string; type: ContextType; description: string }[] = [
  // Projects
  { name: 'ai-chat', type: 'project', description: 'AI chat application with streaming responses' },
  { name: 'task-dashboard', type: 'project', description: 'Task management dashboard with real-time updates' },
  // Domains
  { name: 'reactDev', type: 'domain', description: 'React and frontend development ecosystem' },
  { name: 'agentDev', type: 'domain', description: 'AI agent development and LLM integration' },
];

// ============================================
// OBJECTS
// ============================================

const objects: { name: string; type: ObjectType; description: string }[] = [
  // Languages (2)
  { name: 'TypeScript', type: 'language', description: 'Typed JavaScript superset' },
  { name: 'Python', type: 'language', description: 'General-purpose programming language' },

  // Databases (5)
  { name: 'MongoDB', type: 'database', description: 'Document database with vector search' },
  { name: 'HelixDB', type: 'database', description: 'Graph-vector database' },
  { name: 'Redis', type: 'database', description: 'In-memory key-value store' },
  { name: 'Supabase', type: 'database', description: 'PostgreSQL hosting platform' },
  { name: 'Neon', type: 'database', description: 'Serverless PostgreSQL' },

  // Frameworks (4)
  { name: 'Next.js', type: 'framework', description: 'React meta-framework with SSR/SSG' },
  { name: 'React', type: 'framework', description: 'JavaScript UI library' },
  { name: 'FastAPI', type: 'framework', description: 'Python async web framework' },
  { name: 'TailwindCSS', type: 'framework', description: 'Utility-first CSS framework' },

  // Libs (5)
  { name: 'Zustand', type: 'lib', description: 'Minimal React state management' },
  { name: 'TanStack Query', type: 'lib', description: 'Async state management for React' },
  { name: 'shadcn/ui', type: 'lib', description: 'Radix-based component collection' },
  { name: 'Radix UI', type: 'lib', description: 'Unstyled accessible UI primitives' },
  { name: 'Framer Motion', type: 'lib', description: 'React animation library' },

  // LLMs (3)
  { name: 'GPT', type: 'llm', description: 'OpenAI language model' },
  { name: 'Claude Opus', type: 'llm', description: 'Anthropic flagship model' },
  { name: 'Claude Sonnet', type: 'llm', description: 'Anthropic mid-tier model' },

  // APIs (2)
  { name: 'Vercel AI SDK', type: 'api', description: 'TypeScript SDK for AI applications' },
  { name: 'Anthropic SDK', type: 'api', description: 'Official Claude API client' },

  // Tools (5)
  { name: 'npm', type: 'tool', description: 'Node.js package manager' },
  { name: 'pnpm', type: 'tool', description: 'Fast disk-efficient package manager' },
  { name: 'Docker', type: 'tool', description: 'Container runtime' },
  { name: 'Jest', type: 'tool', description: 'JavaScript testing framework' },
  { name: 'Playwright', type: 'tool', description: 'Browser automation framework' },

  // Fonts (3)
  { name: 'Geist Sans', type: 'font', description: 'Vercel sans-serif typeface' },
  { name: 'Geist Mono', type: 'font', description: 'Vercel monospace typeface' },
  { name: 'JetBrains Mono', type: 'font', description: 'Developer-focused monospace' },
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
  linkTo?: string[]; // Object names to link via About
  inContext?: string[]; // Context names to link via InContext
}

const mems: MemData[] = [
  // Rules (2)
  { statement: 'Options first, implement after - ask before building', type: 'rule', state: 'fact' },
  { statement: 'Do not change user text/content without permission', type: 'rule', state: 'fact' },

  // BestPractices (2)
  { statement: 'Use iterative approach: frequent review, feedback, fix cycle', type: 'bestPractice', state: 'fact' },
  { statement: 'Use Zustand for React state management', type: 'bestPractice', state: 'fact', linkTo: ['Zustand', 'React'], inContext: ['ai-chat'] },

  // Traits (1)
  {
    statement: 'Cares deeply about correct terminology and precise meaning',
    type: 'trait',
    state: 'fact',
    title: 'Semantic Precision',
  },
];

// Version Mems (linked to LLM objects)
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
// PARTOF LINKS (Object -> Domain)
// ============================================

const partOfLinks: { object: string; domain: string }[] = [
  // reactDev domain
  { object: 'TypeScript', domain: 'reactDev' },
  { object: 'React', domain: 'reactDev' },
  { object: 'Next.js', domain: 'reactDev' },
  { object: 'TailwindCSS', domain: 'reactDev' },
  { object: 'Zustand', domain: 'reactDev' },
  { object: 'TanStack Query', domain: 'reactDev' },
  { object: 'shadcn/ui', domain: 'reactDev' },
  { object: 'Radix UI', domain: 'reactDev' },
  { object: 'Framer Motion', domain: 'reactDev' },
  { object: 'Geist Sans', domain: 'reactDev' },
  { object: 'Geist Mono', domain: 'reactDev' },
  { object: 'npm', domain: 'reactDev' },
  { object: 'pnpm', domain: 'reactDev' },
  { object: 'Jest', domain: 'reactDev' },
  { object: 'Playwright', domain: 'reactDev' },
  // agentDev domain
  { object: 'Vercel AI SDK', domain: 'agentDev' },
  { object: 'Anthropic SDK', domain: 'agentDev' },
  { object: 'GPT', domain: 'agentDev' },
  { object: 'Claude Opus', domain: 'agentDev' },
  { object: 'Claude Sonnet', domain: 'agentDev' },
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
      status: 'active',
      title: mem.title,
      notes: mem.notes,
      created_at: now,
    });

    await addMemEmbedding(client, result.id, result.status, now, embedding);

    console.log(`  [${mem.type}] ${mem.statement.slice(0, 50)}... -> ${result.id}`);

    if (mem.linkTo) {
      for (const objName of mem.linkTo) {
        const obj = await getObjectByName(client, objName);
        if (obj) {
          await linkAbout(client, result.id, obj.id);
          console.log(`    -> About: ${objName}`);
        }
      }
    }

    if (mem.inContext) {
      for (const ctxName of mem.inContext) {
        const ctx = await getContextByName(client, ctxName);
        if (ctx) {
          await linkInContext(client, result.id, ctx.id);
          console.log(`    -> InContext: ${ctxName}`);
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
      mem_type: 'version',
      mem_state: 'fact',
      statement: ver.statement,
      status: 'active',
      title: ver.title,
      created_at: now,
    });

    await addMemEmbedding(client, result.id, result.status, now, embedding);

    console.log(`  [version] ${ver.title} -> ${result.id}`);

    const model = await getObjectByName(client, ver.modelName);
    if (model) {
      await linkVersionOf(client, result.id, model.id);
      console.log(`    -> VersionOf ${ver.modelName}`);
    }
  }
}

async function seedPartOfLinks() {
  console.log('\n=== Seeding PartOf Links ===');

  for (const link of partOfLinks) {
    const obj = await getObjectByName(client, link.object);
    const ctx = await getContextByName(client, link.domain);

    if (obj && ctx) {
      await linkPartOf(client, obj.id, ctx.id);
      console.log(`  ${link.object} -> PartOf -> ${link.domain}`);
    } else {
      console.log(`  [SKIP] ${link.object} -> ${link.domain} (not found)`);
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
    await seedPartOfLinks();

    console.log('\n=== Seed Complete ===');
    console.log(`  Contexts: ${contexts.length}`);
    console.log(`  Objects: ${objects.length}`);
    console.log(`  Mems: ${mems.length}`);
    console.log(`  Versions: ${versionMems.length}`);
    console.log(`  PartOf Links: ${partOfLinks.length}`);
    console.log(`  Total nodes: ${contexts.length + objects.length + mems.length + versionMems.length}`);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

main();
