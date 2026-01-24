import { Command } from 'commander';
import { getHelixClient, deleteMem } from '../db/client.js';
import { handleError, confirmDelete } from '../utils/cli.js';

export const forgetCommand = new Command('forget')
  .description('Permanently forget a memory (hard delete)')
  .argument('<id>', 'Memory ID to forget')
  .option('-f, --force', 'Skip confirmation prompt')
  .addHelpText('after', `
Examples:
  $ hypermem forget abc123
  $ hypermem forget abc123 -f

Note: This permanently removes the memory. Use 'dim' to hide without deleting.`)
  .action(async (id: string, options) => {
    try {
      const confirmed = await confirmDelete('memory', id, options.force);
      if (!confirmed) {
        console.log('Cancelled');
        return;
      }
      const client = getHelixClient();
      await deleteMem(client, id);
      console.log(`Forgot memory: ${id}`);
    } catch (error) {
      handleError(error, 'Forget failed');
    }
  });
