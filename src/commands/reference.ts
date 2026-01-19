import { Command } from 'commander';
import { getHelixClient, addReference, getAllReferences, getReferencesByType, deleteReference } from '../db/client.js';
import type { ReferenceType } from '../types/index.js';
import { ReferenceTypeEnum, ReferenceInputSchema } from '../types/schemas.js';
import { validate, parsePositiveInt } from '../utils/validate.js';
import { handleError, output, validateEnum, confirmDelete } from '../utils/cli.js';
import { formatReferenceSingle, formatReferenceList, formatNoneFound } from '../utils/format.js';

export const referenceCommand = new Command('reference')
  .alias('ref')
  .description('Manage external references (urls, docs, commits)');

referenceCommand
  .command('add')
  .description('Add a new reference')
  .argument('<title>', 'Reference title')
  .option('-t, --type <type>', 'Reference type', 'url')
  .option('-u, --uri <uri>', 'URI/URL of the reference')
  .option('--retrieved-at <timestamp>', 'When the reference was retrieved (ISO 8601 / RFC3339), defaults to now')
  .option('--snippet <snippet>', 'Short snippet/excerpt')
  .option('--full-text <text>', 'Full text content')
  .option('--json', 'Output as JSON')
  .addHelpText('after', `
Choices:
  --type: ${ReferenceTypeEnum.options.join(', ')}

Examples:
  $ hypermem ref add "OpenAI API Docs" -u https://platform.openai.com/docs
  $ hypermem ref add "Architecture decision" -t adr --snippet "We chose PostgreSQL"
  $ hypermem ref add "Fix: auth bug" -t commit -u github.com/org/repo/commit/abc123`)
  .action(async (title: string, options) => {
    try {
      const input = validate(ReferenceInputSchema, {
        ref_type: options.type,
        title,
        uri: options.uri,
        retrieved_at: options.retrievedAt,
        snippet: options.snippet,
        full_text: options.fullText,
      }, 'reference');

      const client = getHelixClient();
      const ref = await addReference(client, input);

      output(ref, options.json, (r) => formatReferenceSingle(r));
    } catch (error) {
      handleError(error, 'Failed to add reference');
    }
  });

referenceCommand
  .command('list')
  .description('List references')
  .option('-t, --type <type>', 'Filter by reference type')
  .option('-l, --limit <number>', 'Max results', '20')
  .option('--json', 'Output as JSON')
  .addHelpText('after', `
Choices:
  --type: ${ReferenceTypeEnum.options.join(', ')}

Examples:
  $ hypermem ref list
  $ hypermem ref list -t url -l 10
  $ hypermem ref list -t commit --json`)
  .action(async (options) => {
    try {
      const refType = options.type
        ? validateEnum(options.type, ReferenceTypeEnum, 'type')
        : undefined;
      const limit = parsePositiveInt(options.limit, 'limit');

      const client = getHelixClient();
      let refs = refType
        ? await getReferencesByType(client, refType as ReferenceType)
        : await getAllReferences(client);

      if (refs.length > limit) {
        refs = refs.slice(0, limit);
      }

      if (refs.length === 0) {
        output({ references: [], count: 0 }, options.json, () => {
          formatNoneFound('references');
        });
        return;
      }

      output({ references: refs, count: refs.length }, options.json, () => {
        formatReferenceList(refs);
      });
    } catch (error) {
      handleError(error, 'Failed to list references');
    }
  });

referenceCommand
  .command('delete')
  .description('Delete a reference')
  .argument('<id>', 'Reference ID')
  .option('-f, --force', 'Skip confirmation prompt')
  .addHelpText('after', `
Examples:
  $ hypermem ref delete 1f0f0ed5-4486-6187-a1a5-010203040506
  $ hypermem ref delete 1f0f0ed5-4486-6187-a1a5-010203040506 -f`)
  .action(async (id: string, options) => {
    try {
      const confirmed = await confirmDelete('reference', id, options.force);
      if (!confirmed) {
        console.log('Cancelled');
        return;
      }
      const client = getHelixClient();
      await deleteReference(client, id);
      console.log(`Deleted reference ${id}`);
    } catch (error) {
      handleError(error, 'Failed to delete reference');
    }
  });
