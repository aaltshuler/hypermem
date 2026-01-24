import { Command } from 'commander';
import { getHelixClient, updateMemStatus } from '../db/client.js';
import { handleError } from '../utils/cli.js';

export const dimCommand = new Command('dim')
  .description('Dim a memory (soft delete - hide from default queries)')
  .argument('<id>', 'Memory ID to dim')
  .addHelpText('after', `
Examples:
  $ hypermem dim abc123

Note: Dimmed memories are excluded from search/list by default.
      Use --status DIMMED or --all to see them.
      Use 'undim' to restore.`)
  .action(async (id: string) => {
    try {
      const client = getHelixClient();
      const updated = await updateMemStatus(client, id, 'DIMMED');
      console.log(`Dimmed memory: ${updated.id}`);
      console.log(`  "${updated.statement.slice(0, 60)}${updated.statement.length > 60 ? '...' : ''}"`);
    } catch (error) {
      handleError(error, 'Dim failed');
    }
  });

export const undimCommand = new Command('undim')
  .description('Restore a dimmed memory to active')
  .argument('<id>', 'Memory ID to restore')
  .addHelpText('after', `
Examples:
  $ hypermem undim abc123`)
  .action(async (id: string) => {
    try {
      const client = getHelixClient();
      const updated = await updateMemStatus(client, id, 'ACTIVE');
      console.log(`Restored memory: ${updated.id}`);
      console.log(`  "${updated.statement.slice(0, 60)}${updated.statement.length > 60 ? '...' : ''}"`);
    } catch (error) {
      handleError(error, 'Undim failed');
    }
  });
