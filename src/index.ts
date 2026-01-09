#!/usr/bin/env node

import 'dotenv/config';
import { Command } from 'commander';
import { addCommand } from './commands/add.js';
import { searchCommand } from './commands/search.js';
import { listCommand } from './commands/list.js';
import { deleteCommand } from './commands/delete.js';
import { objectCommand } from './commands/object.js';
import { linkCommand } from './commands/link.js';
import { contextCommand } from './commands/context.js';
import { agentCommand } from './commands/agent.js';
import { realityCheckCommand } from './commands/reality-check.js';

const program = new Command();

program
  .name('hyper-memory')
  .description('Agentic memory framework CLI - Ontology V1')
  .version('0.2.0');

// MEM commands
program.addCommand(addCommand);
program.addCommand(searchCommand);
program.addCommand(listCommand);
program.addCommand(deleteCommand);

// Entity commands
program.addCommand(objectCommand);
program.addCommand(contextCommand);
program.addCommand(agentCommand);

// Edge commands
program.addCommand(linkCommand);

// Utility commands
program.addCommand(realityCheckCommand);

program.parse();
