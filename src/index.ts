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
import { actorCommand } from './commands/actor.js';

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
program.addCommand(actorCommand);

// Edge commands
program.addCommand(linkCommand);

program.parse();
