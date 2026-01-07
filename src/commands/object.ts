import { Command } from 'commander';
import {
  getHelixClient,
  addObject,
  getAllObjects,
  getObjectsByType,
  deleteObject,
} from '../db/client.js';
import type { ObjectType } from '../types/index.js';
import { logger } from '../utils/logger.js';

export const objectCommand = new Command('object')
  .description('Manage OBJECT entities (Tool, Lib, Stack, Model, etc.)');

objectCommand
  .command('add')
  .description('Add a new object')
  .argument('<name>', 'Object name')
  .requiredOption('-t, --type <type>', 'Object type (Tool|Lib|Stack|Template|API|Model|Component|Service)')
  .option('-r, --ref <reference>', 'External reference (e.g., gpt-5.1)')
  .option('-d, --desc <description>', 'Description')
  .action(async (name: string, options) => {
    try {
      const client = getHelixClient();
      const obj = await addObject(client, {
        object_type: options.type as ObjectType,
        name,
        reference: options.ref,
        description: options.desc,
      });

      console.log(`Added object:`);
      console.log(`  id: ${obj.id}`);
      console.log(`  [${obj.object_type}] ${obj.name}`);
      if (obj.reference) console.log(`  ref: ${obj.reference}`);
      if (obj.description) console.log(`  desc: ${obj.description}`);
    } catch (error) {
      logger.error(error, 'Failed to add object');
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

objectCommand
  .command('list')
  .description('List all objects')
  .option('-t, --type <type>', 'Filter by object type')
  .action(async (options) => {
    try {
      const client = getHelixClient();
      const objs = options.type
        ? await getObjectsByType(client, options.type as ObjectType)
        : await getAllObjects(client);

      if (objs.length === 0) {
        console.log('No objects found');
        return;
      }

      console.log(`Found ${objs.length} objects:\n`);

      for (const obj of objs) {
        console.log(`[${obj.object_type}] ${obj.name}`);
        if (obj.reference) console.log(`  ref: ${obj.reference}`);
        if (obj.description) console.log(`  desc: ${obj.description}`);
        console.log(`  id: ${obj.id}`);
        console.log();
      }
    } catch (error) {
      logger.error(error, 'Failed to list objects');
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

objectCommand
  .command('delete')
  .description('Delete an object by ID')
  .argument('<id>', 'Object ID to delete')
  .action(async (id: string) => {
    try {
      const client = getHelixClient();
      await deleteObject(client, id);
      console.log(`Deleted object: ${id}`);
    } catch (error) {
      logger.error(error, 'Failed to delete object');
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });
