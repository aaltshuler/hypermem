import { generateObject } from 'ai';
import { z } from 'zod';
import { openai, MODEL } from './client.js';
import type { MemType, MemState, Confidence } from '../types/index.js';

const ClassificationSchema = z.object({
  mem_type: z.enum([
    'Decision',
    'Problem',
    'Rule',
    'BestPractice',
    'Convention',
    'AntiPattern',
    'Trait',
    'Preference',
    'Causal',
  ]),
  mem_state: z.enum(['FACT', 'ASSUMPTION']),
  confidence: z.enum(['low', 'med', 'high']).optional(),
  isMemoryWorthy: z.boolean(),
});

export interface ClassificationResult {
  mem_type: MemType;
  mem_state: MemState;
  confidence?: Confidence;
  isMemoryWorthy: boolean;
}

export async function classifyMemory(content: string): Promise<ClassificationResult> {
  const { object } = await generateObject({
    model: openai(MODEL),
    schema: ClassificationSchema,
    prompt: `Classify this memory content into the appropriate MEM type.

Content: "${content}"

MEM Types:
- Decision: A decision that was made (architectural, technical, process)
- Problem: A known issue, bug, or challenge
- Rule: A hard rule that must be followed
- BestPractice: A recommended practice or approach
- Convention: A coding or process convention
- AntiPattern: A pattern to avoid
- Trait: A personal characteristic or style
- Preference: A preference or opinion
- Causal: A cause-effect relationship

MEM State:
- FACT: Verified truth, in effect
- ASSUMPTION: Not fully verified, needs confidence level

If ASSUMPTION, set confidence to low/med/high.

Determine:
1. The best MEM type
2. Whether this is FACT or ASSUMPTION
3. Confidence level (only if ASSUMPTION)
4. Whether this is memory-worthy (contains actionable, persistent info)`,
  });

  return {
    mem_type: object.mem_type as MemType,
    mem_state: object.mem_state as MemState,
    confidence: object.confidence as Confidence | undefined,
    isMemoryWorthy: object.isMemoryWorthy,
  };
}
