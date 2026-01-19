import { Command } from 'commander';
import { getHelixClient, addTrace, getAllTraces, getTracesByType, deleteTrace } from '../db/client.js';
import type { TraceType } from '../types/index.js';
import { TraceTypeEnum, TraceInputSchema } from '../types/schemas.js';
import { validate, parsePositiveInt } from '../utils/validate.js';
import { handleError, output, validateEnum, confirmDelete } from '../utils/cli.js';
import { formatTraceSingle, formatTraceList, formatNoneFound } from '../utils/format.js';

export const traceCommand = new Command('trace')
  .description('Manage trace records (sessions, events, snapshots)');

traceCommand
  .command('add')
  .description('Add a new trace')
  .argument('<summary>', 'Trace summary')
  .option('-t, --type <type>', 'Trace type', 'Event')
  .option('--timestamp <timestamp>', 'Timestamp (ISO 8601 / RFC3339), defaults to now')
  .option('-p, --payload <payload>', 'JSON payload')
  .option('--json', 'Output as JSON')
  .addHelpText('after', `
Choices:
  --type: ${TraceTypeEnum.options.join(', ')}

Examples:
  $ hypermem trace add "User started coding session"
  $ hypermem trace add "Deployed v2.0" -t Event --timestamp 2025-12-22T10:00:00Z
  $ hypermem trace add "Weekly snapshot" -t Snapshot -p '{"mems": 150}'`)
  .action(async (summary: string, options) => {
    try {
      const input = validate(TraceInputSchema, {
        trace_type: options.type,
        timestamp: options.timestamp,
        summary,
        payload: options.payload,
      }, 'trace');

      const client = getHelixClient();
      const trace = await addTrace(client, {
        ...input,
        timestamp: input.timestamp || new Date().toISOString(),
      });

      output(trace, options.json, (t) => formatTraceSingle(t));
    } catch (error) {
      handleError(error, 'Failed to add trace');
    }
  });

traceCommand
  .command('list')
  .description('List traces')
  .option('-t, --type <type>', 'Filter by trace type')
  .option('-l, --limit <number>', 'Max results', '20')
  .option('--json', 'Output as JSON')
  .addHelpText('after', `
Choices:
  --type: ${TraceTypeEnum.options.join(', ')}

Examples:
  $ hypermem trace list
  $ hypermem trace list -t Event -l 10
  $ hypermem trace list -t Snapshot --json`)
  .action(async (options) => {
    try {
      const traceType = options.type
        ? validateEnum(options.type, TraceTypeEnum, 'type')
        : undefined;
      const limit = parsePositiveInt(options.limit, 'limit');

      const client = getHelixClient();
      let traces = traceType
        ? await getTracesByType(client, traceType as TraceType)
        : await getAllTraces(client);

      if (traces.length > limit) {
        traces = traces.slice(0, limit);
      }

      if (traces.length === 0) {
        output({ traces: [], count: 0 }, options.json, () => {
          formatNoneFound('traces');
        });
        return;
      }

      output({ traces, count: traces.length }, options.json, () => {
        formatTraceList(traces);
      });
    } catch (error) {
      handleError(error, 'Failed to list traces');
    }
  });

traceCommand
  .command('delete')
  .description('Delete a trace')
  .argument('<id>', 'Trace ID')
  .option('-f, --force', 'Skip confirmation prompt')
  .addHelpText('after', `
Examples:
  $ hypermem trace delete 1f0f0ed5-4486-6187-a1a5-010203040506
  $ hypermem trace delete 1f0f0ed5-4486-6187-a1a5-010203040506 -f`)
  .action(async (id: string, options) => {
    try {
      const confirmed = await confirmDelete('trace', id, options.force);
      if (!confirmed) {
        console.log('Cancelled');
        return;
      }
      const client = getHelixClient();
      await deleteTrace(client, id);
      console.log(`Deleted trace ${id}`);
    } catch (error) {
      handleError(error, 'Failed to delete trace');
    }
  });
