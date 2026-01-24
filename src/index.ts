#!/usr/bin/env node

import 'dotenv/config';
import { Command } from 'commander';
import { addCommand } from './commands/add.js';
import { searchCommand } from './commands/search.js';
import { listCommand } from './commands/list.js';
import { forgetCommand } from './commands/forget.js';
import { dimCommand, undimCommand } from './commands/dim.js';
import { objectCommand } from './commands/object.js';
import { linkCommand } from './commands/link.js';
import { contextCommand } from './commands/context.js';
import { agentCommand } from './commands/agent.js';
import { traceCommand } from './commands/trace.js';
import { referenceCommand } from './commands/reference.js';
import { realityCheckCommand } from './commands/reality-check.js';
import { validateCommand } from './commands/validate.js';
import { onboardCommand } from './commands/onboard.js';

const program = new Command();

program
  .name('hypermem')
  .description('Agentic memory framework CLI')
  .version('0.3.0');

// MEM commands
program.addCommand(addCommand);
program.addCommand(searchCommand);
program.addCommand(listCommand);
program.addCommand(forgetCommand);
program.addCommand(dimCommand);
program.addCommand(undimCommand);

// Entity commands
program.addCommand(objectCommand);
program.addCommand(contextCommand);
program.addCommand(agentCommand);
program.addCommand(traceCommand);
program.addCommand(referenceCommand);

// Edge commands
program.addCommand(linkCommand);

// Utility commands
program.addCommand(realityCheckCommand);
program.addCommand(validateCommand);
program.addCommand(onboardCommand);

program.parse();
