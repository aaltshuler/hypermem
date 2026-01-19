import { classifyMemory } from '../ai/classify.js';
import { generateEmbedding } from '../ai/embed.js';
import {
  getHelixClient,
  addMem,
  addMemEmbedding,
  type AddMemParams,
} from '../db/client.js';
import { MemInputSchema } from '../types/schemas.js';
import type { Mem, MemType, MemState, Confidence, MemStatus, ActorType } from '../types/index.js';
import { logger } from '../utils/logger.js';

export interface WritePipelineInput {
  statement: string;
  mem_type?: MemType;
  mem_state?: MemState;
  confidence?: Confidence;
  status?: MemStatus;
  title?: string;
  tags?: string[];
  notes?: string;
  actors?: ActorType[];
  valid_from?: string;
  valid_to?: string;
}

export interface WritePipelineResult {
  mem: Mem;
  skipped: boolean;
  reason?: string;
}

export async function writePipeline(
  input: WritePipelineInput
): Promise<WritePipelineResult> {
  const client = getHelixClient();
  const now = new Date().toISOString();

  // Determine mem_type and mem_state
  let mem_type: MemType;
  let mem_state: MemState;
  let confidence: Confidence | undefined;

  if (input.mem_type) {
    // User provided type, skip classification
    mem_type = input.mem_type;
    mem_state = input.mem_state || 'FACT';
    confidence = input.confidence;
    logger.info({ mem_type }, 'Using provided mem_type');
  } else {
    // Classify the statement
    logger.info({ statement: input.statement.slice(0, 50) }, 'Classifying memory');
    const classification = await classifyMemory(input.statement);

    if (!classification.isMemoryWorthy) {
      logger.info('Content not memory-worthy, skipping');
      return {
        mem: {} as Mem,
        skipped: true,
        reason: 'Content not memory-worthy',
      };
    }

    mem_type = classification.mem_type;
    mem_state = classification.mem_state;
    confidence = classification.confidence;
  }

  // Validate with Zod schema
  const validated = MemInputSchema.parse({
    mem_type,
    mem_state,
    confidence,
    statement: input.statement,
    status: input.status || 'ACTIVE',
    title: input.title,
    tags: input.tags,
    notes: input.notes,
    actors: input.actors,
  });

  // Generate embedding from statement + notes
  const textToEmbed = input.notes
    ? `${input.statement}\n\n${input.notes}`
    : input.statement;
  logger.info('Generating embedding');
  const embedding = await generateEmbedding(textToEmbed);

  // Store mem
  logger.info('Storing mem');
  const memParams: AddMemParams = {
    mem_type: validated.mem_type,
    mem_state: validated.mem_state,
    confidence: validated.confidence,
    statement: validated.statement,
    status: validated.status,
    title: validated.title,
    tags: validated.tags,
    notes: validated.notes,
    created_at: now,
    actors: validated.actors,
    valid_from: input.valid_from,
    valid_to: input.valid_to,
  };

  const mem = await addMem(client, memParams);

  // Store embedding with status and createdAt for filtering
  await addMemEmbedding(client, mem.id, mem.status, now, embedding);

  logger.info({ memId: mem.id, statement: mem.statement.slice(0, 50) }, 'Mem stored');

  return {
    mem,
    skipped: false,
  };
}
