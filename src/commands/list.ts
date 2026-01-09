import { Command } from 'commander';
import { listPipeline, listAllPipeline } from '../pipelines/read.js';
import type { MemType, MemStatus } from '../types/index.js';
import { logger } from '../utils/logger.js';

const MEM_TYPES: MemType[] = [
  'Decision', 'Problem', 'Rule', 'BestPractice', 'Convention',
  'AntiPattern', 'Trait', 'Preference', 'Causal', 'Version'
];

const MEM_STATUSES: MemStatus[] = ['ACTIVE', 'SUPERSEDED', 'CONTESTED', 'ARCHIVED'];

function normalizeType(input: string): MemType | undefined {
  const lower = input.toLowerCase();
  return MEM_TYPES.find(t => t.toLowerCase() === lower);
}

function normalizeStatus(input: string): MemStatus | undefined {
  const upper = input.toUpperCase();
  return MEM_STATUSES.find(s => s === upper);
}

export const listCommand = new Command('list')
  .description('List memories (all or filtered)')
  .option('-t, --type <type>', 'Filter by MEM type')
  .option('-s, --status <status>', 'Filter by status (ACTIVE|SUPERSEDED|CONTESTED|ARCHIVED)')
  .option('-a, --all', 'List all memories (default)')
  .action(async (options) => {
    try {
      let mems;
      let memType: MemType | undefined;
      let memStatus: MemStatus | undefined;

      if (options.type) {
        memType = normalizeType(options.type);
        if (!memType) {
          console.error(`Invalid type: "${options.type}"`);
          console.error(`Valid types: ${MEM_TYPES.join(', ')}`);
          process.exit(1);
        }
      }

      if (options.status) {
        memStatus = normalizeStatus(options.status);
        if (!memStatus) {
          console.error(`Invalid status: "${options.status}"`);
          console.error(`Valid statuses: ${MEM_STATUSES.join(', ')}`);
          process.exit(1);
        }
      }

      if (memType || memStatus) {
        mems = await listPipeline({
          mem_type: memType,
          status: memStatus,
        });
      } else {
        mems = await listAllPipeline();
      }

      if (!mems || mems.length === 0) {
        console.log('No memories found');
        return;
      }

      console.log(`Found ${mems.length} memories:\n`);

      for (const mem of mems) {
        console.log(`[${mem.mem_type}] ${mem.mem_state}${mem.confidence ? ` (${mem.confidence})` : ''}`);
        console.log(`  ${mem.statement}`);
        if (mem.title) console.log(`  title: ${mem.title}`);
        if (mem.notes) console.log(`  notes: ${mem.notes.slice(0, 60)}${mem.notes.length > 60 ? '...' : ''}`);
        console.log(`  id: ${mem.id}`);
        console.log(`  status: ${mem.status} | created: ${mem.created_at}`);
        console.log();
      }
    } catch (error) {
      logger.error(error, 'List failed');
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });
