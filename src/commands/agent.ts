import { Command } from 'commander';
import {
  getHelixClient,
  addAgent,
  getAllAgents,
  getAgent,
} from '../db/client.js';
import { logger } from '../utils/logger.js';

export const agentCommand = new Command('agent')
  .description('Manage AGENT entities (AI agent instances)');

agentCommand
  .command('add')
  .description('Add a new agent')
  .argument('<name>', 'Agent name')
  .requiredOption('-m, --model <model>', 'Model identifier (e.g., gpt-5.2-2025-12-11)')
  .option('-f, --function <function>', 'Agent function/purpose')
  .action(async (name: string, options) => {
    try {
      const client = getHelixClient();
      const agent = await addAgent(client, {
        name,
        model: options.model,
        function: options.function,
      });

      console.log(`Added agent:`);
      console.log(`  id: ${agent.id}`);
      console.log(`  name: ${agent.name}`);
      console.log(`  model: ${agent.model}`);
      if (agent.function) console.log(`  function: ${agent.function}`);
    } catch (error) {
      logger.error(error, 'Failed to add agent');
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

agentCommand
  .command('list')
  .description('List all agents')
  .action(async () => {
    try {
      const client = getHelixClient();
      const agents = await getAllAgents(client);

      if (agents.length === 0) {
        console.log('No agents found');
        return;
      }

      console.log(`Found ${agents.length} agents:\n`);

      for (const agent of agents) {
        console.log(`${agent.name} (${agent.model})`);
        if (agent.function) console.log(`  function: ${agent.function}`);
        console.log(`  id: ${agent.id}`);
        console.log();
      }
    } catch (error) {
      logger.error(error, 'Failed to list agents');
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

agentCommand
  .command('get')
  .description('Get an agent by ID')
  .argument('<id>', 'Agent ID')
  .action(async (id: string) => {
    try {
      const client = getHelixClient();
      const agent = await getAgent(client, id);

      if (!agent) {
        console.log(`Agent not found: ${id}`);
        return;
      }

      console.log(`Agent:`);
      console.log(`  id: ${agent.id}`);
      console.log(`  name: ${agent.name}`);
      console.log(`  model: ${agent.model}`);
      if (agent.function) console.log(`  function: ${agent.function}`);
    } catch (error) {
      logger.error(error, 'Failed to get agent');
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });
