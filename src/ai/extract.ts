import { generateObject } from 'ai';
import { z } from 'zod';
import { openai, MODEL } from './client.js';

const ExtractionSchema = z.object({
  atoms: z.array(
    z.object({
      content: z.string(),
      isAtomic: z.boolean(),
    })
  ),
});

export async function extractAtoms(content: string): Promise<string[]> {
  const { object } = await generateObject({
    model: openai(MODEL),
    schema: ExtractionSchema,
    prompt: `Split this content into atomic, single-claim statements.

Each atom should be:
- A single fact, preference, or piece of information
- Self-contained and understandable on its own
- No conjunctions combining multiple independent facts
- Preserve the original meaning and specificity

If the content is already atomic (a single claim), return it as-is.

Content: "${content}"

Return each extracted atom with isAtomic=true if it's properly atomic.`,
  });

  return object.atoms.filter((a) => a.isAtomic).map((a) => a.content);
}
