import { Command } from 'commander';
import { getHelixClient, deleteMem } from '../db/client.js';
import { logger } from '../utils/logger.js';

export const deleteCommand = new Command('delete')
  .description('Delete a memory by ID')
  .argument('<id>', 'Memory ID to delete')
  .action(async (id: string) => {
    try {
      const client = getHelixClient();
      await deleteMem(client, id);
      console.log(`Deleted memory: ${id}`);
    } catch (error) {
      logger.error(error, 'Delete failed');
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });
