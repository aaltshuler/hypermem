import { Command } from 'commander';
import {
  getHelixClient,
  addObject,
  getAllObjects,
  getObjectsByType,
  deleteObject,
} from '../db/client.js';
import type { ObjectType } from '../types/index.js';
import { ObjectTypeEnum, ObjectInputSchema } from '../types/schemas.js';
import { validate } from '../utils/validate.js';
import { handleError, output, validateEnum, confirmDelete } from '../utils/cli.js';
import { formatObjectSingle, formatObjectList, formatNoneFound } from '../utils/format.js';

export const objectCommand = new Command('object')
  .description('Manage OBJECT entities (Tool, Lib, Stack, Model, etc.)');

objectCommand
  .command('add')
  .description('Add a new object')
  .argument('<name>', 'Object name')
  .requiredOption('-t, --type <type>', 'Object type')
  .option('-r, --ref <reference>', 'External reference (e.g., gpt-5.1)')
  .option('-d, --desc <description>', 'Description')
  .option('--json', 'Output as JSON')
  .addHelpText('after', `
Choices:
  --type: ${ObjectTypeEnum.options.join(', ')}

Examples:
  $ hypermem object add React -t Framework -d "UI library"
  $ hypermem object add GPT-5.2 -t Model -r gpt-5.2-2025-12-11
  $ hypermem object add Prisma -t Lib -d "TypeScript ORM" --json`)
  .action(async (name: string, options) => {
    try {
      const input = validate(ObjectInputSchema, {
        object_type: options.type,
        name,
        reference: options.ref,
        description: options.desc,
      }, 'object');

      const client = getHelixClient();
      const obj = await addObject(client, input);

      output(obj, options.json, (o) => formatObjectSingle(o));
    } catch (error) {
      handleError(error, 'Failed to add object');
    }
  });

objectCommand
  .command('list')
  .description('List all objects')
  .option('-t, --type <type>', 'Filter by object type')
  .option('--json', 'Output as JSON')
  .addHelpText('after', `
Choices:
  --type: ${ObjectTypeEnum.options.join(', ')}

Examples:
  $ hypermem object list
  $ hypermem object list -t Model
  $ hypermem object list -t Framework --json`)
  .action(async (options) => {
    try {
      const objType = options.type
        ? validateEnum(options.type, ObjectTypeEnum, 'type')
        : undefined;

      const client = getHelixClient();
      const objs = objType
        ? await getObjectsByType(client, objType as ObjectType)
        : await getAllObjects(client);

      if (objs.length === 0) {
        output({ objects: [], count: 0 }, options.json, () => {
          formatNoneFound('objects');
        });
        return;
      }

      output({ objects: objs, count: objs.length }, options.json, () => {
        formatObjectList(objs);
      });
    } catch (error) {
      handleError(error, 'Failed to list objects');
    }
  });

objectCommand
  .command('delete')
  .description('Delete an object by ID')
  .argument('<id>', 'Object ID to delete')
  .option('-f, --force', 'Skip confirmation prompt')
  .addHelpText('after', `
Examples:
  $ hypermem object delete 1f0f0ed5-4486-6187-a1a5-010203040506
  $ hypermem object delete 1f0f0ed5-4486-6187-a1a5-010203040506 -f`)
  .action(async (id: string, options) => {
    try {
      const confirmed = await confirmDelete('object', id, options.force);
      if (!confirmed) {
        console.log('Cancelled');
        return;
      }
      const client = getHelixClient();
      await deleteObject(client, id);
      console.log(`Deleted object: ${id}`);
    } catch (error) {
      handleError(error, 'Failed to delete object');
    }
  });
