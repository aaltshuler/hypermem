import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getHelixClient, addMem, addMemEmbedding } from './client.js';
import { generateEmbedding } from '../ai/embed.js';
import type { MemType, MemState } from '../types/index.js';
import { logger } from '../utils/logger.js';

interface SeedMem {
  mem_type: MemType;
  mem_state: MemState;
  confidence?: 'low' | 'med' | 'high';
  statement: string;
  title?: string;
  notes?: string;
  tags?: string[];
}

interface SeedData {
  mems: SeedMem[];
}

export async function seedDatabase(): Promise<void> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const seedPath = join(__dirname, '../../seed/sample-data.json');

  console.log('Loading seed data...');
  const raw = await readFile(seedPath, 'utf-8');
  const data: SeedData = JSON.parse(raw);

  const client = getHelixClient();
  const now = new Date().toISOString();

  console.log(`Seeding ${data.mems.length} memories...\n`);

  for (let i = 0; i < data.mems.length; i++) {
    const m = data.mems[i];

    console.log(`[${i + 1}/${data.mems.length}] ${m.statement.slice(0, 50)}...`);

    // Generate embedding from statement + notes
    const textToEmbed = m.notes ? `${m.statement}\n\n${m.notes}` : m.statement;
    const embedding = await generateEmbedding(textToEmbed);

    // Store mem
    const mem = await addMem(client, {
      mem_type: m.mem_type,
      mem_state: m.mem_state,
      confidence: m.confidence,
      statement: m.statement,
      status: 'ACTIVE',
      title: m.title,
      tags: m.tags,
      notes: m.notes,
      created_at: now,
    });

    // Store embedding
    await addMemEmbedding(client, mem.id, mem.status, now, embedding);

    logger.info({ memId: mem.id, mem_type: m.mem_type }, 'Seeded mem');
  }

  console.log('\nSeed complete!');
  console.log(`Total mems: ${data.mems.length}`);
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}
