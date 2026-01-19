import { Command } from 'commander';
import {
  getHelixClient,
  linkAbout,
  linkInContext,
  linkProposedByAgent,
  linkVersionOf,
  linkHasEvidence,
  linkHasEvidenceRef,
  linkSupersedes,
  linkContradicts,
  linkDependsOn,
  linkHasCause,
  linkHasEffect,
  linkRelated,
  updateMemStatus,
} from '../db/client.js';
import { handleError } from '../utils/cli.js';

export const linkCommand = new Command('link')
  .description('Create edges between entities')
  .addHelpText('after', `
Examples:
  $ hypermem link about <memId> <objectId>      # Link mem to what it's about
  $ hypermem link context <memId> <contextId>   # Link mem to where it applies
  $ hypermem link supersedes <new> <old> -r "Updated info"`);

linkCommand
  .command('about')
  .description('Link a MEM to an OBJECT (what the memory is about)')
  .argument('<memId>', 'Memory ID')
  .argument('<objectId>', 'Object ID')
  .addHelpText('after', `
Example:
  $ hypermem link about abc123 def456  # Link mem about TypeScript`)
  .action(async (memId: string, objectId: string) => {
    try {
      const client = getHelixClient();
      await linkAbout(client, memId, objectId);
      console.log(`Linked MEM ${memId} -> ABOUT -> Object ${objectId}`);
    } catch (error) {
      handleError(error, 'Failed to create link');
    }
  });

linkCommand
  .command('context')
  .description('Link a MEM to a CONTEXT (where it applies)')
  .argument('<memId>', 'Memory ID')
  .argument('<contextId>', 'Context ID')
  .addHelpText('after', `
Example:
  $ hypermem link context abc123 def456  # Link mem to my-project`)
  .action(async (memId: string, contextId: string) => {
    try {
      const client = getHelixClient();
      await linkInContext(client, memId, contextId);
      console.log(`Linked MEM ${memId} -> IN_CONTEXT -> Context ${contextId}`);
    } catch (error) {
      handleError(error, 'Failed to create link');
    }
  });

linkCommand
  .command('proposedby')
  .description('Link a MEM to an AGENT (who proposed it)')
  .argument('<memId>', 'Memory ID')
  .argument('<agentId>', 'Agent ID')
  .action(async (memId: string, agentId: string) => {
    try {
      const client = getHelixClient();
      await linkProposedByAgent(client, memId, agentId);
      console.log(`Linked MEM ${memId} -> PROPOSED_BY -> Agent ${agentId}`);
    } catch (error) {
      handleError(error, 'Failed to create link');
    }
  });

linkCommand
  .command('versionof')
  .description('Link a Version MEM to a Model OBJECT')
  .argument('<memId>', 'Version memory ID')
  .argument('<objectId>', 'Model object ID')
  .action(async (memId: string, objectId: string) => {
    try {
      const client = getHelixClient();
      await linkVersionOf(client, memId, objectId);
      console.log(`Linked MEM ${memId} -> VERSION_OF -> Object ${objectId}`);
    } catch (error) {
      handleError(error, 'Failed to create link');
    }
  });

linkCommand
  .command('trace')
  .description('Link a MEM to a TRACE as evidence')
  .argument('<memId>', 'Memory ID')
  .argument('<traceId>', 'Trace ID')
  .action(async (memId: string, traceId: string) => {
    try {
      const client = getHelixClient();
      await linkHasEvidence(client, memId, traceId);
      console.log(`Linked MEM ${memId} -> HAS_EVIDENCE -> Trace ${traceId}`);
    } catch (error) {
      handleError(error, 'Failed to create link');
    }
  });

linkCommand
  .command('evidence')
  .description('Link a MEM to a REFERENCE as evidence')
  .argument('<memId>', 'Memory ID')
  .argument('<refId>', 'Reference ID')
  .action(async (memId: string, refId: string) => {
    try {
      const client = getHelixClient();
      await linkHasEvidenceRef(client, memId, refId);
      console.log(`Linked MEM ${memId} -> HAS_EVIDENCE_REF -> Reference ${refId}`);
    } catch (error) {
      handleError(error, 'Failed to create link');
    }
  });

linkCommand
  .command('supersedes')
  .description('Link a new MEM superseding an old one')
  .argument('<newMemId>', 'New memory ID')
  .argument('<oldMemId>', 'Old memory ID being superseded')
  .requiredOption('-r, --reason <reason>', 'Reason for superseding')
  .addHelpText('after', `
Example:
  $ hypermem link supersedes new123 old456 -r "Updated based on new findings"`)
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
      handleError(error, 'Failed to create supersedes link');
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
      handleError(error, 'Failed to create contradicts link');
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
      handleError(error, 'Failed to create depends link');
    }
  });

linkCommand
  .command('cause')
  .description('Link an effect MEM to its cause MEM (for Causal types)')
  .argument('<effectMemId>', 'Effect memory ID')
  .argument('<causeMemId>', 'Cause memory ID')
  .action(async (effectMemId: string, causeMemId: string) => {
    try {
      const client = getHelixClient();
      await linkHasCause(client, effectMemId, causeMemId);
      console.log(`Linked MEM ${effectMemId} -> HAS_CAUSE -> MEM ${causeMemId}`);
    } catch (error) {
      handleError(error, 'Failed to create cause link');
    }
  });

linkCommand
  .command('effect')
  .description('Link a cause MEM to its effect MEM (for Causal types)')
  .argument('<causeMemId>', 'Cause memory ID')
  .argument('<effectMemId>', 'Effect memory ID')
  .action(async (causeMemId: string, effectMemId: string) => {
    try {
      const client = getHelixClient();
      await linkHasEffect(client, causeMemId, effectMemId);
      console.log(`Linked MEM ${causeMemId} -> HAS_EFFECT -> MEM ${effectMemId}`);
    } catch (error) {
      handleError(error, 'Failed to create effect link');
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
      handleError(error, 'Failed to create related link');
    }
  });
