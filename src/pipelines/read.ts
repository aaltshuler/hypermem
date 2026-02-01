import { generateEmbedding } from '../ai/embed.js';
import {
  getHelixClient,
  searchMems,
  getAllMems,
  getMemsByType,
  getMemsByStatus,
  getMem,
} from '../db/client.js';
import type { Mem, MemType, MemStatus } from '../types/index.js';
import { logger } from '../utils/logger.js';

export interface SearchOptions {
  limit?: number;
  status?: MemStatus;
  all?: boolean; // Include DIMMED memories
}

export interface SearchResult {
  mem: Mem;
  similarity: number;
  score: number;
}

export async function readPipeline(
  query: string,
  options: SearchOptions = {}
): Promise<SearchResult[]> {
  const { limit = 10, status, all = false } = options;
  const client = getHelixClient();

  // Step 1: Generate query embedding
  logger.info({ query }, 'Generating query embedding');
  const queryEmbedding = await generateEmbedding(query);

  // Step 2: Vector search (fetch extra for post-filtering)
  logger.info('Performing vector search');
  const vectorResults = await searchMems(client, queryEmbedding, limit * 2);

  if (vectorResults.length === 0) {
    logger.info('No vector matches found');
    return [];
  }

  // Step 3: Fetch all mems and filter by matched IDs
  logger.info('Fetching mem details');
  const allMems = await getAllMems(client);
  const memMap = new Map(allMems.map((m) => [m.id, m]));

  // Step 4: Join vector results with mems (filter by status)
  const results: SearchResult[] = [];
  for (const vr of vectorResults) {
    const mem = memMap.get(vr.memId);
    if (mem) {
      // Filter by specific status if provided
      if (status && mem.status !== status) continue;
      // Exclude DIMMED by default unless --all is set
      if (!all && !status && mem.status === 'dimmed') continue;
      results.push({
        mem,
        similarity: vr.similarity,
        score: vr.similarity,
      });
    }
  }

  // Sort by score descending
  const reranked = results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  logger.info({ count: reranked.length }, 'Search complete');
  return reranked;
}

export async function textSearchPipeline(
  query: string,
  options: SearchOptions = {}
): Promise<Mem[]> {
  const { limit = 10, status, all = false } = options;
  const client = getHelixClient();

  logger.info({ query }, 'Performing text search');
  const allMems = await getAllMems(client);

  const queryLower = query.toLowerCase();
  let filtered = allMems.filter(m =>
    m.statement.toLowerCase().includes(queryLower) ||
    m.title?.toLowerCase().includes(queryLower) ||
    m.notes?.toLowerCase().includes(queryLower)
  );

  // Filter by specific status if provided
  if (status) {
    filtered = filtered.filter(m => m.status === status);
  } else if (!all) {
    // Exclude DIMMED by default unless --all is set
    filtered = filtered.filter(m => m.status !== 'dimmed');
  }

  const results = filtered.slice(0, limit);
  logger.info({ count: results.length }, 'Text search complete');
  return results;
}

export interface ListOptions {
  mem_type?: MemType;
  status?: MemStatus;
  all?: boolean; // Include DIMMED memories
}

export async function listPipeline(
  options: ListOptions = {}
): Promise<Mem[]> {
  const { mem_type, status, all = false } = options;
  const client = getHelixClient();

  // Get all mems and filter client-side (getMemsByType/Status have single-result bug)
  logger.info({ mem_type, status, all }, 'Listing mems');
  const allMems = await getAllMems(client);

  let filtered = allMems;
  if (mem_type) {
    filtered = filtered.filter(m => m.mem_type === mem_type);
  }
  if (status) {
    filtered = filtered.filter(m => m.status === status);
  } else if (!all) {
    // Exclude DIMMED by default unless --all is set
    filtered = filtered.filter(m => m.status !== 'dimmed');
  }

  logger.info({ count: filtered.length }, 'List complete');
  return filtered;
}

export async function listAllPipeline(): Promise<Mem[]> {
  const client = getHelixClient();
  logger.info('Listing all mems');
  const mems = await getAllMems(client);
  logger.info({ count: mems.length }, 'List complete');
  return mems;
}

export async function getMemPipeline(id: string): Promise<Mem | null> {
  const client = getHelixClient();
  logger.info({ id }, 'Getting mem');
  return getMem(client, id);
}
