import { Command } from 'commander';
import chalk from 'chalk';
import { readPipeline } from '../pipelines/read.js';
import { MemStatusEnum } from '../types/schemas.js';
import { parsePositiveInt } from '../utils/validate.js';
import { handleError, output, validateEnum } from '../utils/cli.js';
import { formatMemSearchResult, formatNoneFound } from '../utils/format.js';

export const vsearchCommand = new Command('vsearch')
  .description('Search memories by semantic/vector similarity')
  .argument('<query>', 'Search query')
  .option('-l, --limit <number>', 'Max results', '10')
  .option('-s, --status <status>', 'Filter by status')
  .option('--json', 'Output as JSON')
  .addHelpText('after', `
Choices:
  --status: ${MemStatusEnum.options.join(', ')}

Examples:
  $ hypermem search "TypeScript best practices"
  $ hypermem search "database" -l 5
  $ hypermem search "conventions" -s ACTIVE --json`)
  .action(async (query: string, options) => {
    try {
      const limit = parsePositiveInt(options.limit, 'limit');
      const status = options.status
        ? validateEnum(options.status, MemStatusEnum, 'status')
        : undefined;

      const results = await readPipeline(query, { limit, status, all: true });

      if (results.length === 0) {
        output({ results: [], count: 0 }, options.json, () => formatNoneFound('memories'));
        return;
      }

      output(
        { results: results.map((r) => ({ ...r.mem, score: r.score })), count: results.length },
        options.json,
        () => {
          console.log(`Found ${chalk.green.bold(results.length.toString())} memories:\n`);
          for (let i = 0; i < results.length; i++) {
            formatMemSearchResult(results[i].mem, results[i].score, i + 1);
          }
        }
      );
    } catch (error) {
      handleError(error, 'Search failed');
    }
  });
