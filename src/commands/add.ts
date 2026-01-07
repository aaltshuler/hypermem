import { Command } from 'commander';
import { writePipeline } from '../pipelines/write.js';
import type { MemType, MemState, Confidence } from '../types/index.js';
import { logger } from '../utils/logger.js';

export const addCommand = new Command('add')
  .description('Add a new memory (MEM)')
  .argument('<statement>', 'Memory statement to store')
  .option('-t, --type <type>', 'MEM type (Decision|Problem|Rule|BestPractice|Convention|AntiPattern|Trait|Preference|Causal)')
  .option('-s, --state <state>', 'MEM state (FACT|ASSUMPTION)', 'FACT')
  .option('-c, --confidence <confidence>', 'Confidence level (low|med|high) - required if ASSUMPTION')
  .option('--title <title>', 'Short title for the memory')
  .option('--tags <tags>', 'Comma-separated tags')
  .option('--notes <notes>', 'Additional notes')
  .action(async (statement: string, options) => {
    try {
      const tags = options.tags ? options.tags.split(',').map((t: string) => t.trim()) : undefined;

      const result = await writePipeline({
        statement,
        mem_type: options.type as MemType | undefined,
        mem_state: options.state as MemState,
        confidence: options.confidence as Confidence | undefined,
        title: options.title,
        tags,
        notes: options.notes,
      });

      if (result.skipped) {
        console.log(`Skipped: ${result.reason}`);
        return;
      }

      const { mem } = result;
      console.log(`Added memory:`);
      console.log(`  id: ${mem.id}`);
      console.log(`  [${mem.mem_type}] ${mem.mem_state}${mem.confidence ? ` (${mem.confidence})` : ''}`);
      console.log(`  ${mem.statement.slice(0, 80)}${mem.statement.length > 80 ? '...' : ''}`);
      if (mem.title) console.log(`  title: ${mem.title}`);
      if (mem.tags && mem.tags.length > 0) console.log(`  tags: ${mem.tags.join(', ')}`);
      console.log(`  status: ${mem.status}`);
    } catch (error) {
      logger.error(error, 'Failed to add memory');
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });
