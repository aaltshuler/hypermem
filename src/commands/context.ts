import { Command } from 'commander';
import {
  getHelixClient,
  addContext,
  getAllContexts,
  deleteContext,
} from '../db/client.js';
import type { ContextType } from '../types/index.js';
import { logger } from '../utils/logger.js';

export const contextCommand = new Command('context')
  .description('Manage CONTEXT entities (Org, Project)');

contextCommand
  .command('add')
  .description('Add a new context')
  .argument('<name>', 'Context name')
  .requiredOption('-t, --type <type>', 'Context type (Org|Project)')
  .option('-d, --desc <description>', 'Description')
  .action(async (name: string, options) => {
    try {
      const client = getHelixClient();
      const ctx = await addContext(client, {
        context_type: options.type as ContextType,
        name,
        description: options.desc,
      });

      console.log(`Added context:`);
      console.log(`  id: ${ctx.id}`);
      console.log(`  [${ctx.context_type}] ${ctx.name}`);
      if (ctx.description) console.log(`  desc: ${ctx.description}`);
    } catch (error) {
      logger.error(error, 'Failed to add context');
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

contextCommand
  .command('list')
  .description('List all contexts')
  .action(async () => {
    try {
      const client = getHelixClient();
      const ctxs = await getAllContexts(client);

      if (ctxs.length === 0) {
        console.log('No contexts found');
        return;
      }

      console.log(`Found ${ctxs.length} contexts:\n`);

      for (const ctx of ctxs) {
        console.log(`[${ctx.context_type}] ${ctx.name}`);
        if (ctx.description) console.log(`  desc: ${ctx.description}`);
        console.log(`  id: ${ctx.id}`);
        console.log();
      }
    } catch (error) {
      logger.error(error, 'Failed to list contexts');
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

contextCommand
  .command('delete')
  .description('Delete a context by ID')
  .argument('<id>', 'Context ID to delete')
  .action(async (id: string) => {
    try {
      const client = getHelixClient();
      await deleteContext(client, id);
      console.log(`Deleted context: ${id}`);
    } catch (error) {
      logger.error(error, 'Failed to delete context');
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });
