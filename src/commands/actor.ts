import { Command } from 'commander';
import {
  getHelixClient,
  addActor,
  getAllActors,
  deleteActor,
} from '../db/client.js';
import type { ActorType } from '../types/index.js';
import { logger } from '../utils/logger.js';

export const actorCommand = new Command('actor')
  .description('Manage ACTOR entities (Person, Agent)');

actorCommand
  .command('add')
  .description('Add a new actor')
  .argument('<name>', 'Actor name')
  .requiredOption('-t, --type <type>', 'Actor type (Person|Agent)')
  .action(async (name: string, options) => {
    try {
      const client = getHelixClient();
      const actor = await addActor(client, {
        actor_type: options.type as ActorType,
        name,
      });

      console.log(`Added actor:`);
      console.log(`  id: ${actor.id}`);
      console.log(`  [${actor.actor_type}] ${actor.name}`);
    } catch (error) {
      logger.error(error, 'Failed to add actor');
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

actorCommand
  .command('list')
  .description('List all actors')
  .action(async () => {
    try {
      const client = getHelixClient();
      const actors = await getAllActors(client);

      if (actors.length === 0) {
        console.log('No actors found');
        return;
      }

      console.log(`Found ${actors.length} actors:\n`);

      for (const actor of actors) {
        console.log(`[${actor.actor_type}] ${actor.name}`);
        console.log(`  id: ${actor.id}`);
        console.log();
      }
    } catch (error) {
      logger.error(error, 'Failed to list actors');
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

actorCommand
  .command('delete')
  .description('Delete an actor by ID')
  .argument('<id>', 'Actor ID to delete')
  .action(async (id: string) => {
    try {
      const client = getHelixClient();
      await deleteActor(client, id);
      console.log(`Deleted actor: ${id}`);
    } catch (error) {
      logger.error(error, 'Failed to delete actor');
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });
