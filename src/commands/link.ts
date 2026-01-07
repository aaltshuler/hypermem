import { Command } from 'commander';
import {
  getHelixClient,
  linkAbout,
  linkInContext,
  linkProposedBy,
  linkSupersedes,
  linkContradicts,
  linkDependsOn,
  linkRelated,
  updateMemStatus,
} from '../db/client.js';
import { logger } from '../utils/logger.js';

export const linkCommand = new Command('link')
  .description('Create edges between entities');

linkCommand
  .command('about')
  .description('Link a MEM to an OBJECT (what the memory is about)')
  .argument('<memId>', 'Memory ID')
  .argument('<objectId>', 'Object ID')
  .action(async (memId: string, objectId: string) => {
    try {
      const client = getHelixClient();
      await linkAbout(client, memId, objectId);
      console.log(`Linked MEM ${memId} -> ABOUT -> Object ${objectId}`);
    } catch (error) {
      logger.error(error, 'Failed to create link');
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

linkCommand
  .command('context')
  .description('Link a MEM to a CONTEXT (where it applies)')
  .argument('<memId>', 'Memory ID')
  .argument('<contextId>', 'Context ID')
  .action(async (memId: string, contextId: string) => {
    try {
      const client = getHelixClient();
      await linkInContext(client, memId, contextId);
      console.log(`Linked MEM ${memId} -> IN_CONTEXT -> Context ${contextId}`);
    } catch (error) {
      logger.error(error, 'Failed to create link');
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

linkCommand
  .command('proposedby')
  .description('Link a MEM to an ACTOR (who proposed it)')
  .argument('<memId>', 'Memory ID')
  .argument('<actorId>', 'Actor ID')
  .action(async (memId: string, actorId: string) => {
    try {
      const client = getHelixClient();
      await linkProposedBy(client, memId, actorId);
      console.log(`Linked MEM ${memId} -> PROPOSED_BY -> Actor ${actorId}`);
    } catch (error) {
      logger.error(error, 'Failed to create link');
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

linkCommand
  .command('supersedes')
  .description('Link a new MEM superseding an old one')
  .argument('<newMemId>', 'New memory ID')
  .argument('<oldMemId>', 'Old memory ID being superseded')
  .requiredOption('-r, --reason <reason>', 'Reason for superseding')
  .action(async (newMemId: string, oldMemId: string, options) => {
    try {
      const client = getHelixClient();
      // Create supersedes edge
      await linkSupersedes(client, newMemId, oldMemId, options.reason);
      // Update old mem status to SUPERSEDED
      await updateMemStatus(client, oldMemId, 'SUPERSEDED');
      console.log(`Linked MEM ${newMemId} -> SUPERSEDES -> MEM ${oldMemId}`);
      console.log(`Updated MEM ${oldMemId} status to SUPERSEDED`);
    } catch (error) {
      logger.error(error, 'Failed to create supersedes link');
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

linkCommand
  .command('contradicts')
  .description('Link two contradicting MEMs')
  .argument('<memId1>', 'First memory ID')
  .argument('<memId2>', 'Second memory ID')
  .action(async (memId1: string, memId2: string) => {
    try {
      const client = getHelixClient();
      await linkContradicts(client, memId1, memId2);
      // Mark at least one as contested
      await updateMemStatus(client, memId2, 'CONTESTED');
      console.log(`Linked MEM ${memId1} -> CONTRADICTS -> MEM ${memId2}`);
      console.log(`Updated MEM ${memId2} status to CONTESTED`);
    } catch (error) {
      logger.error(error, 'Failed to create contradicts link');
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

linkCommand
  .command('depends')
  .description('Link a MEM that depends on another MEM')
  .argument('<memId>', 'Memory ID')
  .argument('<dependsOnMemId>', 'Memory ID that this depends on')
  .action(async (memId: string, dependsOnMemId: string) => {
    try {
      const client = getHelixClient();
      await linkDependsOn(client, memId, dependsOnMemId);
      console.log(`Linked MEM ${memId} -> DEPENDS_ON -> MEM ${dependsOnMemId}`);
    } catch (error) {
      logger.error(error, 'Failed to create depends link');
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

linkCommand
  .command('related')
  .description('Link two related MEMs')
  .argument('<memId1>', 'First memory ID')
  .argument('<memId2>', 'Second memory ID')
  .action(async (memId1: string, memId2: string) => {
    try {
      const client = getHelixClient();
      await linkRelated(client, memId1, memId2);
      console.log(`Linked MEM ${memId1} -> RELATED -> MEM ${memId2}`);
    } catch (error) {
      logger.error(error, 'Failed to create related link');
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });
