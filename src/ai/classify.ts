import { generateObject } from 'ai';
import { z } from 'zod';
import { openai, MODEL } from './client.js';
import type { MemType, MemState, Confidence } from '../types/index.js';

const ClassificationSchema = z.object({
  mem_type: z.enum([
    'decision',
    'problem',
    'rule',
    'bestPractice',
    'lexicon',
    'trait',
    'version',
  ]),
  mem_state: z.enum(['fact', 'assumption']),
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
- decision: A decision that was made (architectural, technical, process)
- problem: A known issue, bug, or challenge
- rule: A hard rule that must be followed (includes things to avoid)
- bestpractice: A recommended practice or approach
- lexicon: High-bandwidth shorthand - curated vocabulary where abbreviations expand to full meaning (e.g., "W" = width, "P" = padding)
- trait: A personal characteristic or working style
- version: A specific version of a library, framework, model, or tool

MEM State:
- fact: Verified truth, in effect
- assumption: Not fully verified, needs confidence level

If assumption, set confidence to low/med/high.

Determine:
1. The best MEM type
2. Whether this is fact or assumption
3. Confidence level (only if assumption)
4. Whether this is memory-worthy (contains actionable, persistent info)`,
  });

  return {
    mem_type: object.mem_type as MemType,
    mem_state: object.mem_state as MemState,
    confidence: object.confidence as Confidence | undefined,
    isMemoryWorthy: object.isMemoryWorthy,
  };
}
