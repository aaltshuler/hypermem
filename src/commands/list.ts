import { Command } from 'commander';
import { listPipeline } from '../pipelines/read.js';
import { MemTypeEnum, MemStatusEnum } from '../types/schemas.js';
import { handleError, output, validateEnum } from '../utils/cli.js';
import { formatMemList, formatNoneFound } from '../utils/format.js';

// Aliases for common queries
const ALIASES: Record<string, { type?: string; status?: string }> = {
  decisions: { type: 'decision', status: 'active' },
  problems: { type: 'problem', status: 'active' },
  rules: { type: 'rule', status: 'active' },
  bestpractices: { type: 'bestPractice', status: 'active' },
  lexicon: { type: 'lexicon', status: 'active' },
  traits: { type: 'trait', status: 'active' },
  versions: { type: 'version', status: 'active' },
};

export const listCommand = new Command('list')
  .description('List memories (ACTIVE only by default)')
  .argument('[alias]', `Shortcut: ${Object.keys(ALIASES).join(', ')}`)
  .option('-t, --type <type>', 'Filter by MEM type')
  .option('-s, --status <status>', 'Filter by status (default: ACTIVE)')
  .option('-a, --all', 'Include all statuses (DIMMED, SUPERSEDED, etc.)')
  .option('--json', 'Output as JSON')
  .addHelpText('after', `
Aliases:
  decisions     problems      rules         bestpractices
  lexicon       traits        versions

Examples:
  $ hypermem list                 # All ACTIVE memories
  $ hypermem list rules           # Active Rule mems
  $ hypermem list lexicon         # Active Lexicon mems
  $ hypermem list versions        # Active Version mems
  $ hypermem list --all           # Include all statuses`)
  .action(async (alias: string | undefined, options) => {
    try {
      // Resolve alias
      const aliasConfig = alias ? ALIASES[alias.toLowerCase()] : undefined;
      if (alias && !aliasConfig) {
        console.error(`Unknown alias: "${alias}"`);
        console.error(`Valid aliases: ${Object.keys(ALIASES).join(', ')}`);
        process.exit(1);
      }

      // Determine type and status
      const memType = options.type
        ? validateEnum(options.type, MemTypeEnum, 'type')
        : aliasConfig?.type
          ? (aliasConfig.type as typeof MemTypeEnum._type)
          : undefined;

      let memStatus = options.status
        ? validateEnum(options.status, MemStatusEnum, 'status')
        : aliasConfig?.status
          ? (aliasConfig.status as typeof MemStatusEnum._type)
          : undefined;

      // Default to ACTIVE unless --all is set
      if (!options.all && !memStatus) {
        memStatus = 'active';
      }

      const mems = await listPipeline({
        mem_type: memType,
        status: options.all ? undefined : memStatus,
        all: options.all,
      });

      if (!mems || mems.length === 0) {
        output({ mems: [], count: 0 }, options.json, () => formatNoneFound('memories'));
        return;
      }

      output({ mems, count: mems.length }, options.json, () => formatMemList(mems));
    } catch (error) {
      handleError(error, 'List failed');
    }
  });
