import { Command } from 'commander';
import { readPipeline } from '../pipelines/read.js';
import type { MemStatus } from '../types/index.js';
import { logger } from '../utils/logger.js';

export const searchCommand = new Command('search')
  .description('Search memories by semantic similarity')
  .argument('<query>', 'Search query')
  .option('-l, --limit <number>', 'Max results', parseInt, 10)
  .option('-s, --status <status>', 'Filter by status (ACTIVE|SUPERSEDED|CONTESTED|ARCHIVED)')
  .action(async (query: string, options) => {
    try {
      const results = await readPipeline(query, {
        limit: options.limit,
        status: options.status as MemStatus | undefined,
      });

      if (results.length === 0) {
        console.log('No memories found');
        return;
      }

      console.log(`Found ${results.length} memories:\n`);

      for (let i = 0; i < results.length; i++) {
        const r = results[i];
        const { mem } = r;
        console.log(`${i + 1}. [${mem.mem_type}] ${mem.mem_state}${mem.confidence ? ` (${mem.confidence})` : ''} (score: ${r.score.toFixed(3)})`);
        console.log(`   ${mem.statement}`);
        if (mem.title) console.log(`   title: ${mem.title}`);
        if (mem.notes) console.log(`   notes: ${mem.notes.slice(0, 100)}${mem.notes.length > 100 ? '...' : ''}`);
        console.log(`   id: ${mem.id} | status: ${mem.status}`);
        console.log();
      }
    } catch (error) {
      logger.error(error, 'Search failed');
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });
