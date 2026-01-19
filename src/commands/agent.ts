import { Command } from 'commander';
import {
  getHelixClient,
  addAgent,
  getAllAgents,
  getAgent,
} from '../db/client.js';
import { AgentInputSchema } from '../types/schemas.js';
import { validate } from '../utils/validate.js';
import { handleError, output } from '../utils/cli.js';
import { formatAgentSingle, formatAgentList, formatNoneFound, formatNotFound } from '../utils/format.js';

export const agentCommand = new Command('agent')
  .description('Manage AGENT entities (AI agent instances)');

agentCommand
  .command('add')
  .description('Add a new agent')
  .argument('<name>', 'Agent name')
  .requiredOption('-m, --model <model>', 'Model identifier (e.g., gpt-5.2-2025-12-11)')
  .option('--function <function>', 'Agent function/purpose')
  .option('--json', 'Output as JSON')
  .addHelpText('after', `
Examples:
  $ hypermem agent add CodeAssist -m gpt-5.2-2025-12-11
  $ hypermem agent add Reviewer -m claude-opus-4-5-20251101 --function "Code review"`)
  .action(async (name: string, options) => {
    try {
      const input = validate(AgentInputSchema, {
        name,
        model: options.model,
        function: options.function,
      }, 'agent');

      const client = getHelixClient();
      const agent = await addAgent(client, input);

      output(agent, options.json, (a) => formatAgentSingle(a));
    } catch (error) {
      handleError(error, 'Failed to add agent');
    }
  });

agentCommand
  .command('list')
  .description('List all agents')
  .option('--json', 'Output as JSON')
  .addHelpText('after', `
Examples:
  $ hypermem agent list
  $ hypermem agent list --json`)
  .action(async (options) => {
    try {
      const client = getHelixClient();
      const agents = await getAllAgents(client);

      if (agents.length === 0) {
        output({ agents: [], count: 0 }, options.json, () => {
          formatNoneFound('agents');
        });
        return;
      }

      output({ agents, count: agents.length }, options.json, () => {
        formatAgentList(agents);
      });
    } catch (error) {
      handleError(error, 'Failed to list agents');
    }
  });

agentCommand
  .command('get')
  .description('Get an agent by ID')
  .argument('<id>', 'Agent ID')
  .option('--json', 'Output as JSON')
  .addHelpText('after', `
Examples:
  $ hypermem agent get 1f0f0ed5-4486-6187-a1a5-010203040506
  $ hypermem agent get 1f0f0ed5-4486-6187-a1a5-010203040506 --json`)
  .action(async (id: string, options) => {
    try {
      const client = getHelixClient();
      const agent = await getAgent(client, id);

      if (!agent) {
        output({ error: 'not_found', id }, options.json, () => {
          formatNotFound('Agent', id);
        });
        return;
      }

      output(agent, options.json, (a) => formatAgentSingle(a, 'Agent'));
    } catch (error) {
      handleError(error, 'Failed to get agent');
    }
  });
