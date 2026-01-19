import { Command } from 'commander';
import { writePipeline } from '../pipelines/write.js';
import type { MemType, MemState, Confidence, ActorType } from '../types/index.js';
import { MemTypeEnum, MemStateEnum, ConfidenceEnum, ActorTypeEnum } from '../types/schemas.js';
import { handleError, output } from '../utils/cli.js';
import { formatMemSingle } from '../utils/format.js';

export const addCommand = new Command('add')
  .description('Add a new memory (MEM)')
  .argument('<statement>', 'Memory statement to store')
  .option('-t, --type <type>', 'MEM type')
  .option('--state <state>', 'MEM state', 'FACT')
  .option('-c, --confidence <confidence>', 'Confidence level - required if ASSUMPTION')
  .option('--actors <actors>', 'Who contributed (comma-separated: human,agent)')
  .option('--title <title>', 'Short title for the memory')
  .option('--tags <tags>', 'Comma-separated tags')
  .option('--notes <notes>', 'Additional notes')
  .option('--valid-from <date>', 'Valid from date (ISO 8601 / RFC3339)')
  .option('--valid-to <date>', 'Valid to date (ISO 8601 / RFC3339)')
  .option('--json', 'Output as JSON')
  .addHelpText('after', `
Choices:
  --type:       ${MemTypeEnum.options.join(', ')}
  --state:      ${MemStateEnum.options.join(', ')}
  --confidence: ${ConfidenceEnum.options.join(', ')}
  --actors:     ${ActorTypeEnum.options.join(', ')}

Examples:
  $ hypermem add "Always use TypeScript strict mode"
  $ hypermem add "Use Tailwind for styling" -t Convention --tags "css,frontend"
  $ hypermem add "This might break in v2" --state ASSUMPTION -c med
  $ hypermem add "GPT-5.2 released Dec 2025" -t Version --json`)
  .action(async (statement: string, options) => {
    try {
      const tags = options.tags ? options.tags.split(',').map((t: string) => t.trim()) : undefined;
      const actors = options.actors
        ? options.actors.split(',').map((a: string) => a.trim() as ActorType)
        : undefined;

      const result = await writePipeline({
        statement,
        mem_type: options.type as MemType | undefined,
        mem_state: options.state as MemState,
        confidence: options.confidence as Confidence | undefined,
        title: options.title,
        tags,
        notes: options.notes,
        actors,
        valid_from: options.validFrom,
        valid_to: options.validTo,
      });

      if (result.skipped) {
        output({ skipped: true, reason: result.reason }, options.json, () => {
          console.log(`Skipped: ${result.reason}`);
        });
        return;
      }

      output(result.mem, options.json, (m) => formatMemSingle(m));
    } catch (error) {
      handleError(error, 'Failed to add memory');
    }
  });
