import { Command } from 'commander';
import { getHelixClient, getMem, updateMemLastValidated } from '../db/client.js';
import { logger } from '../utils/logger.js';

export const validateCommand = new Command('validate')
  .description('Mark a mem as validated (update last_validated_at)')
  .argument('<id>', 'Mem ID to validate')
  .option('--at <timestamp>', 'Validation timestamp (ISO 8601 / RFC3339), defaults to now')
  .action(async (id: string, options) => {
    try {
      const client = getHelixClient();

      // Check mem exists
      const existing = await getMem(client, id);
      if (!existing) {
        console.error(`Mem ${id} not found`);
        process.exit(1);
      }

      const timestamp = options.at || new Date().toISOString();
      const mem = await updateMemLastValidated(client, id, timestamp);

      console.log(`Validated mem:`);
      console.log(`  id: ${mem.id}`);
      console.log(`  [${mem.mem_type}] ${mem.statement.slice(0, 60)}${mem.statement.length > 60 ? '...' : ''}`);
      console.log(`  last_validated_at: ${mem.last_validated_at}`);
    } catch (error) {
      logger.error(error, 'Failed to validate mem');
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });
