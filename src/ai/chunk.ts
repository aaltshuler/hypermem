import { RecursiveChunker, Chunk } from '@chonkiejs/core';

// Default chunk configuration optimized for embeddings
const DEFAULT_CHUNK_SIZE = 512; // tokens (characters in core mode)
const DEFAULT_MIN_CHARS = 24;

// Chunker instance type inferred from create()
type ChunkerInstance = Awaited<ReturnType<typeof RecursiveChunker.create>>;
let chunkerInstance: ChunkerInstance | null = null;

/**
 * Get or create the chunker instance
 */
async function getChunker(): Promise<ChunkerInstance> {
  if (!chunkerInstance) {
    chunkerInstance = await RecursiveChunker.create({
      chunkSize: DEFAULT_CHUNK_SIZE,
      minCharactersPerChunk: DEFAULT_MIN_CHARS,
    });
  }
  return chunkerInstance;
}

export interface TextChunk {
  text: string;
  index: number;
  tokenCount: number;
}

/**
 * Chunk text into semantic segments suitable for embedding
 *
 * Uses hierarchical splitting: paragraphs → sentences → punctuation → words
 * Each level only activates if chunks exceed the configured size.
 *
 * @param text - The text to chunk
 * @param options - Optional chunking configuration
 * @returns Array of text chunks with metadata
 */
export async function chunkText(
  text: string,
  options?: {
    chunkSize?: number;
    minChars?: number;
  }
): Promise<TextChunk[]> {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // Use custom chunker if options differ from defaults
  let chunker: ChunkerInstance;
  if (options?.chunkSize || options?.minChars) {
    chunker = await RecursiveChunker.create({
      chunkSize: options.chunkSize ?? DEFAULT_CHUNK_SIZE,
      minCharactersPerChunk: options.minChars ?? DEFAULT_MIN_CHARS,
    });
  } else {
    chunker = await getChunker();
  }

  const chunks: Chunk[] = await chunker.chunk(text);

  return chunks.map((chunk: Chunk, index: number) => ({
    text: chunk.text,
    index,
    tokenCount: chunk.tokenCount,
  }));
}

/**
 * Chunk text and return just the text strings
 * Convenience function for simple use cases
 */
export async function chunkTextSimple(text: string): Promise<string[]> {
  const chunks = await chunkText(text);
  return chunks.map((c) => c.text);
}

/**
 * Prepare text for embedding by combining fields and chunking if needed
 *
 * For short texts (under chunk size), returns single chunk.
 * For longer texts, splits into semantic chunks.
 *
 * @param fields - Object fields to combine for embedding
 * @returns Array of text chunks ready for embedding
 */
export async function prepareForEmbedding(
  fields: Record<string, string | undefined>
): Promise<TextChunk[]> {
  // Combine non-empty fields with newlines
  const combined = Object.entries(fields)
    .filter(([_, value]) => value && value.trim().length > 0)
    .map(([_, value]) => value!.trim())
    .join('\n\n');

  if (!combined) {
    return [];
  }

  // If text is short enough, return as single chunk
  if (combined.length < DEFAULT_CHUNK_SIZE) {
    return [
      {
        text: combined,
        index: 0,
        tokenCount: combined.length,
      },
    ];
  }

  return chunkText(combined);
}
