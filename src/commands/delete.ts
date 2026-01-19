import { Command } from 'commander';
import { getHelixClient, deleteMem } from '../db/client.js';
import { handleError, confirmDelete } from '../utils/cli.js';

export const deleteCommand = new Command('delete')
  .description('Delete a memory by ID')
  .argument('<id>', 'Memory ID to delete')
  .option('-f, --force', 'Skip confirmation prompt')
  .addHelpText('after', `
Examples:
  $ hypermem delete 1f0f0ed5-4486-6187-a1a5-010203040506
  $ hypermem delete 1f0f0ed5-4486-6187-a1a5-010203040506 -f`)
  .action(async (id: string, options) => {
    try {
      const confirmed = await confirmDelete('memory', id, options.force);
      if (!confirmed) {
        console.log('Cancelled');
        return;
      }
      const client = getHelixClient();
      await deleteMem(client, id);
      console.log(`Deleted memory: ${id}`);
    } catch (error) {
      handleError(error, 'Delete failed');
    }
  });
