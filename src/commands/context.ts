import { Command } from 'commander';
import {
  getHelixClient,
  addContext,
  getAllContexts,
  deleteContext,
} from '../db/client.js';
import { ContextTypeEnum, ContextInputSchema } from '../types/schemas.js';
import { validate } from '../utils/validate.js';
import { handleError, output, confirmDelete } from '../utils/cli.js';
import { formatContextSingle, formatContextList, formatNoneFound } from '../utils/format.js';

export const contextCommand = new Command('context')
  .description('Manage CONTEXT entities (Org, Project, Domain, Stage)');

contextCommand
  .command('add')
  .description('Add a new context')
  .argument('<name>', 'Context name')
  .requiredOption('-t, --type <type>', 'Context type')
  .option('-d, --desc <description>', 'Description')
  .option('--json', 'Output as JSON')
  .addHelpText('after', `
Choices:
  --type: ${ContextTypeEnum.options.join(', ')}

Examples:
  $ hypermem context add my-project -t Project -d "Main web app"
  $ hypermem context add Acme Corp -t Org -d "Client organization"
  $ hypermem context add Frontend -t Domain -d "Frontend development"
  $ hypermem context add Production -t Stage -d "Production environment"`)
  .action(async (name: string, options) => {
    try {
      const input = validate(ContextInputSchema, {
        context_type: options.type,
        name,
        description: options.desc,
      }, 'context');

      const client = getHelixClient();
      const ctx = await addContext(client, input);

      output(ctx, options.json, (c) => formatContextSingle(c));
    } catch (error) {
      handleError(error, 'Failed to add context');
    }
  });

contextCommand
  .command('list')
  .description('List all contexts')
  .option('--json', 'Output as JSON')
  .addHelpText('after', `
Examples:
  $ hypermem context list
  $ hypermem context list --json`)
  .action(async (options) => {
    try {
      const client = getHelixClient();
      const ctxs = await getAllContexts(client);

      if (ctxs.length === 0) {
        output({ contexts: [], count: 0 }, options.json, () => {
          formatNoneFound('contexts');
        });
        return;
      }

      output({ contexts: ctxs, count: ctxs.length }, options.json, () => {
        formatContextList(ctxs);
      });
    } catch (error) {
      handleError(error, 'Failed to list contexts');
    }
  });

contextCommand
  .command('delete')
  .description('Delete a context by ID')
  .argument('<id>', 'Context ID to delete')
  .option('-f, --force', 'Skip confirmation prompt')
  .addHelpText('after', `
Examples:
  $ hypermem context delete 1f0f0ed5-4486-6187-a1a5-010203040506
  $ hypermem context delete 1f0f0ed5-4486-6187-a1a5-010203040506 -f`)
  .action(async (id: string, options) => {
    try {
      const confirmed = await confirmDelete('context', id, options.force);
      if (!confirmed) {
        console.log('Cancelled');
        return;
      }
      const client = getHelixClient();
      await deleteContext(client, id);
      console.log(`Deleted context: ${id}`);
    } catch (error) {
      handleError(error, 'Failed to delete context');
    }
  });
