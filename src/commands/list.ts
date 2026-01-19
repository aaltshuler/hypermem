import { Command } from 'commander';
import { listPipeline, listAllPipeline } from '../pipelines/read.js';
import { MemTypeEnum, MemStatusEnum } from '../types/schemas.js';
import { handleError, output, validateEnum } from '../utils/cli.js';
import { formatMemList, formatNoneFound } from '../utils/format.js';

export const listCommand = new Command('list')
  .description('List memories (all or filtered)')
  .option('-t, --type <type>', 'Filter by MEM type')
  .option('-s, --status <status>', 'Filter by status')
  .option('-a, --all', 'List all memories (default)')
  .option('--json', 'Output as JSON')
  .addHelpText('after', `
Choices:
  --type:   ${MemTypeEnum.options.join(', ')}
  --status: ${MemStatusEnum.options.join(', ')}

Examples:
  $ hypermem list
  $ hypermem list -t Convention
  $ hypermem list -t Version -s ACTIVE
  $ hypermem list --json | jq '.mems[].statement'`)
  .action(async (options) => {
    try {
      const memType = options.type
        ? validateEnum(options.type, MemTypeEnum, 'type')
        : undefined;
      const memStatus = options.status
        ? validateEnum(options.status, MemStatusEnum, 'status')
        : undefined;

      const mems = memType || memStatus
        ? await listPipeline({ mem_type: memType, status: memStatus })
        : await listAllPipeline();

      if (!mems || mems.length === 0) {
        output({ mems: [], count: 0 }, options.json, () => {
          formatNoneFound('memories');
        });
        return;
      }

      output({ mems, count: mems.length }, options.json, () => {
        formatMemList(mems);
      });
    } catch (error) {
      handleError(error, 'List failed');
    }
  });
