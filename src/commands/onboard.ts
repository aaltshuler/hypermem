import { Command } from 'commander';
import { getHelixClient, getAllMems, getAllObjects, getAllContexts } from '../db/client.js';
import { logger } from '../utils/logger.js';

export const onboardCommand = new Command('onboard')
  .description('Quick start guide for agents using hypermem')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    try {
      const client = getHelixClient();

      // Fetch stats
      const allMems = await getAllMems(client);
      const activeMems = allMems.filter((m) => m.status === 'active');
      const objects = await getAllObjects(client);
      const contexts = await getAllContexts(client);

      // Group mems by type
      const memsByType: Record<string, number> = {};
      for (const mem of activeMems) {
        memsByType[mem.mem_type] = (memsByType[mem.mem_type] || 0) + 1;
      }

      // Group objects by type
      const objectsByType: Record<string, number> = {};
      for (const obj of objects) {
        objectsByType[obj.object_type] = (objectsByType[obj.object_type] || 0) + 1;
      }

      if (options.json) {
        console.log(
          JSON.stringify(
            {
              description:
                'Hypermem is your persistent knowledge store. It contains curated memories about user preferences, project conventions, technical decisions, library versions, and lessons learned. Check relevant memories before starting work to understand constraints and avoid past mistakes. Add new memories when you learn something valuable.',
              quickReference: {
                beforeTask: [
                  'hypermem search "<topic>"',
                  'hypermem list --type Rule',
                  'hypermem list --type Version',
                  'hypermem reality-check',
                ],
                addKnowledge: [
                  'hypermem add "<statement>" --type <Type> --tags "x,y"',
                  'hypermem link about <memId> <objectId>',
                ],
                updateKnowledge: [
                  'hypermem link supersedes <new> <old> --reason "why"',
                  'hypermem validate <memId>',
                ],
              },
              memTypes: {
                Rule: 'Must follow (constraints)',
                AntiPattern: 'Must avoid (learned mistakes)',
                BestPractice: 'Should follow (recommendations)',
                Convention: 'Team standard',
                Decision: 'Architecture/tech choice',
                Version: 'Library/model version info',
                Problem: 'Known issue',
                Preference: 'User likes/dislikes',
                Trait: 'User behavior patterns',
                Causal: 'Cause-effect relationships',
              },
              stats: {
                mems: { total: allMems.length, active: activeMems.length, byType: memsByType },
                objects: { total: objects.length, byType: objectsByType },
                contexts: contexts.length,
              },
            },
            null,
            2
          )
        );
        return;
      }

      // Text output
      console.log(`
╭────────────────────────────────────────────╮
│       HYPERMEM AGENT ONBOARDING            │
╰────────────────────────────────────────────╯

Hypermem is your persistent, queryable external memory.

You need to use it to:
  - Check rules and constraints you must follow
  - Search for relevant past decisions and conventions
  - Look up up-to-date library/model versions
  - Understand user preferences and traits

GET STARTED
═══════════

First run hypermem reality-check to get you started.
Then use hypermem --help to explore what hypermem can do and how to use it.

Review the current project setup and figure out what you need to know.

For example, if setting up a new Next.js project, you need to know:
  - Which library to use for UI components
  - Which library to use for state management
  - Which versions they should be
  - And so on...

KEEP IN MIND
════════════

You can traverse the graph to find more about project setup and
user preferences.

Hypermem is living memory. It gets constantly updated, so use it
as the source of truth for project setup and user preferences.

AFTER ONBOARDING
════════════════

Add relevant rules, conventions, best practices, anti-patterns,
and preferences to CLAUDE.md.

Specify that you need to use hypermem regularly to stay consistent
and up to date. Add CLI references for useful commands.

Do not overdo it! Only essentials. You can always update later.

MEM TYPES
═════════

  Rule         → Must follow (constraints)
  AntiPattern  → Must avoid (learned mistakes)
  BestPractice → Should follow (recommendations)
  Convention   → Team standard
  Decision     → Architecture/tech choice
  Version      → Library/model version info
  Problem      → Known issue
  Preference   → User likes/dislikes
  Trait        → User behavior patterns
  Causal       → Cause-effect relationships

MEMORY SNAPSHOT
══════════════

  Mems: ${allMems.length} total, ${activeMems.length} active
  Objects: ${objects.length}
  Contexts: ${contexts.length}
`);

      // Print mem breakdown
      const memTypeOrder = [
        'rule',
        'bestPractice',
        'decision',
        'version',
        'problem',
        'trait',
        'lexicon',
      ];
      const memBreakdown = memTypeOrder
        .filter((t) => memsByType[t])
        .map((t) => `${memsByType[t]} ${t}`)
        .join(', ');
      if (memBreakdown) {
        console.log(`  Active mems: ${memBreakdown}`);
      }

      // Print object breakdown
      const objTypeOrder = ['Model', 'Lib', 'Framework', 'API', 'Tool', 'Database', 'Language', 'Font'];
      const objBreakdown = objTypeOrder
        .filter((t) => objectsByType[t])
        .map((t) => `${objectsByType[t]} ${t}`)
        .join(', ');
      if (objBreakdown) {
        console.log(`  Objects: ${objBreakdown}`);
      }
    } catch (error) {
      logger.error(error, 'Failed to run onboard');
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });
