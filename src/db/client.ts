import { HelixDB, type HelixDBClient } from 'helix-ts';
import type {
  Mem,
  MemType,
  MemState,
  Confidence,
  MemStatus,
  ActorType,
  ObjectEntity,
  ObjectType,
  Context,
  ContextType,
  Agent,
  Trace,
  TraceType,
  Reference,
  ReferenceType,
} from '../types/index.js';

// Create HelixDB client
export function createHelixClient(url?: string): HelixDBClient {
  const dbUrl = url || process.env.HELIX_URL || 'http://localhost:6969';
  return new HelixDB(dbUrl);
}

// Singleton client instance
let client: HelixDBClient | null = null;

export function getHelixClient(): HelixDBClient {
  if (!client) {
    client = createHelixClient();
  }
  return client;
}

// Helper to normalize array responses
function normalizeArray<T>(data: unknown): T[] {
  if (!data) return [];
  return Array.isArray(data) ? (data as T[]) : [data as T];
}

// ============================================
// MEM OPERATIONS
// ============================================

export interface AddMemParams {
  mem_type: MemType;
  mem_state: MemState;
  confidence?: Confidence;
  statement: string;
  status: MemStatus;
  title?: string;
  tags?: string[];
  notes?: string;
  valid_from?: string;
  valid_to?: string;
  created_at: string;
  actors?: ActorType[];
}

export async function addMem(
  client: HelixDBClient,
  params: AddMemParams
): Promise<Mem> {
  const result = await client.query('addMem', {
    mem_type: params.mem_type,
    mem_state: params.mem_state,
    confidence: params.confidence || '',
    statement: params.statement,
    status: params.status,
    title: params.title || '',
    tags: JSON.stringify(params.tags || []),
    notes: params.notes || '',
    valid_from: params.valid_from || '',
    valid_to: params.valid_to || '',
    created_at: params.created_at,
    actors: JSON.stringify(params.actors || []),
  });
  const data = (result as { mem?: Mem }).mem;
  if (!data) throw new Error('Failed to add mem');
  // Parse tags and actors back to arrays
  if (typeof data.tags === 'string') {
    data.tags = data.tags ? JSON.parse(data.tags) : [];
  }
  if (typeof data.actors === 'string') {
    data.actors = data.actors ? JSON.parse(data.actors) : [];
  }
  return data;
}

export async function getMem(
  client: HelixDBClient,
  id: string
): Promise<Mem | null> {
  const result = await client.query('getMem', { id });
  const data = (result as { mem?: Mem }).mem;
  if (!data) return null;
  if (typeof data.tags === 'string') {
    data.tags = data.tags ? JSON.parse(data.tags) : [];
  }
  if (typeof data.actors === 'string') {
    data.actors = data.actors ? JSON.parse(data.actors) : [];
  }
  return data;
}

export async function getAllMems(client: HelixDBClient): Promise<Mem[]> {
  const result = await client.query('getAllMems', {});
  const data = (result as { mems?: unknown }).mems;
  const mems = normalizeArray<Mem>(data);
  return mems.map((m) => ({
    ...m,
    tags: typeof m.tags === 'string' ? (m.tags ? JSON.parse(m.tags) : []) : m.tags,
    actors: typeof m.actors === 'string' ? (m.actors ? JSON.parse(m.actors) : []) : m.actors,
  }));
}

export async function getMemsByType(
  client: HelixDBClient,
  mem_type: MemType
): Promise<Mem[]> {
  const result = await client.query('getMemsByType', { mem_type });
  const data = (result as { mems?: unknown }).mems;
  const mems = normalizeArray<Mem>(data);
  return mems.map((m) => ({
    ...m,
    tags: typeof m.tags === 'string' ? (m.tags ? JSON.parse(m.tags) : []) : m.tags,
    actors: typeof m.actors === 'string' ? (m.actors ? JSON.parse(m.actors) : []) : m.actors,
  }));
}

export async function getMemsByStatus(
  client: HelixDBClient,
  status: MemStatus
): Promise<Mem[]> {
  const result = await client.query('getMemsByStatus', { status });
  const data = (result as { mems?: unknown }).mems;
  const mems = normalizeArray<Mem>(data);
  return mems.map((m) => ({
    ...m,
    tags: typeof m.tags === 'string' ? (m.tags ? JSON.parse(m.tags) : []) : m.tags,
    actors: typeof m.actors === 'string' ? (m.actors ? JSON.parse(m.actors) : []) : m.actors,
  }));
}

export async function deleteMem(
  client: HelixDBClient,
  id: string
): Promise<void> {
  await client.query('deleteMem', { id });
}

// Note: HelixQL doesn't support updates. For status changes,
// use delete + add pattern at application layer
export async function updateMemStatus(
  client: HelixDBClient,
  id: string,
  newStatus: MemStatus
): Promise<Mem> {
  // Get existing mem
  const existing = await getMem(client, id);
  if (!existing) throw new Error(`Mem ${id} not found`);

  // Delete old
  await deleteMem(client, id);

  // Re-add with new status (ID will be different - this is a limitation)
  return addMem(client, {
    mem_type: existing.mem_type,
    mem_state: existing.mem_state,
    confidence: existing.confidence,
    statement: existing.statement,
    status: newStatus,
    title: existing.title,
    tags: existing.tags,
    notes: existing.notes,
    valid_from: existing.valid_from,
    valid_to: existing.valid_to,
    created_at: existing.created_at,
    actors: existing.actors,
  });
}

// ============================================
// OBJECT OPERATIONS
// ============================================

export interface AddObjectParams {
  object_type: ObjectType;
  name: string;
  reference?: string;
  description?: string;
}

export async function addObject(
  client: HelixDBClient,
  params: AddObjectParams
): Promise<ObjectEntity> {
  const result = await client.query('addObject', {
    object_type: params.object_type,
    name: params.name,
    reference: params.reference || '',
    description: params.description || '',
  });
  const data = (result as { obj?: ObjectEntity }).obj;
  if (!data) throw new Error('Failed to add object');
  return data;
}

export async function getObject(
  client: HelixDBClient,
  id: string
): Promise<ObjectEntity | null> {
  const result = await client.query('getObject', { id });
  return (result as { obj?: ObjectEntity }).obj || null;
}

export async function getObjectByName(
  client: HelixDBClient,
  name: string
): Promise<ObjectEntity | null> {
  const result = await client.query('getObjectByName', { name });
  return (result as { obj?: ObjectEntity }).obj || null;
}

export async function getAllObjects(
  client: HelixDBClient
): Promise<ObjectEntity[]> {
  const result = await client.query('getAllObjects', {});
  const data = (result as { objs?: unknown }).objs;
  return normalizeArray<ObjectEntity>(data);
}

export async function getObjectsByType(
  client: HelixDBClient,
  object_type: ObjectType
): Promise<ObjectEntity[]> {
  const result = await client.query('getObjectsByType', { object_type });
  const data = (result as { objs?: unknown }).objs;
  return normalizeArray<ObjectEntity>(data);
}

export async function deleteObject(
  client: HelixDBClient,
  id: string
): Promise<void> {
  await client.query('deleteObject', { id });
}

// ============================================
// CONTEXT OPERATIONS
// ============================================

export interface AddContextParams {
  context_type: ContextType;
  name: string;
  description?: string;
}

export async function addContext(
  client: HelixDBClient,
  params: AddContextParams
): Promise<Context> {
  const result = await client.query('addContext', {
    context_type: params.context_type,
    name: params.name,
    description: params.description || '',
  });
  const data = (result as { ctx?: Context }).ctx;
  if (!data) throw new Error('Failed to add context');
  return data;
}

export async function getContext(
  client: HelixDBClient,
  id: string
): Promise<Context | null> {
  const result = await client.query('getContext', { id });
  return (result as { ctx?: Context }).ctx || null;
}

export async function getContextByName(
  client: HelixDBClient,
  name: string
): Promise<Context | null> {
  const result = await client.query('getContextByName', { name });
  return (result as { ctx?: Context }).ctx || null;
}

export async function getAllContexts(client: HelixDBClient): Promise<Context[]> {
  const result = await client.query('getAllContexts', {});
  const data = (result as { ctxs?: unknown }).ctxs;
  return normalizeArray<Context>(data);
}

export async function deleteContext(
  client: HelixDBClient,
  id: string
): Promise<void> {
  await client.query('deleteContext', { id });
}

// ============================================
// AGENT OPERATIONS
// ============================================

export interface AddAgentParams {
  name: string;
  model: string;
  function?: string;
}

export async function addAgent(
  client: HelixDBClient,
  params: AddAgentParams
): Promise<Agent> {
  const result = await client.query('addAgent', {
    name: params.name,
    model: params.model,
    function: params.function || '',
  });
  const data = (result as { agent?: Agent }).agent;
  if (!data) throw new Error('Failed to add agent');
  return data;
}

export async function getAgent(
  client: HelixDBClient,
  id: string
): Promise<Agent | null> {
  const result = await client.query('getAgent', { id });
  return (result as { agent?: Agent }).agent || null;
}

export async function getAgentByName(
  client: HelixDBClient,
  name: string
): Promise<Agent | null> {
  const result = await client.query('getAgentByName', { name });
  return (result as { agent?: Agent }).agent || null;
}

export async function getAllAgents(client: HelixDBClient): Promise<Agent[]> {
  const result = await client.query('getAllAgents', {});
  const data = (result as { agents?: unknown }).agents;
  return normalizeArray<Agent>(data);
}

// ============================================
// TRACE OPERATIONS
// ============================================

export interface AddTraceParams {
  trace_type: TraceType;
  timestamp: string;
  summary: string;
  payload?: string;
}

export async function addTrace(
  client: HelixDBClient,
  params: AddTraceParams
): Promise<Trace> {
  const result = await client.query('addTrace', {
    trace_type: params.trace_type,
    timestamp: params.timestamp,
    summary: params.summary,
    payload: params.payload || '',
  });
  const data = (result as { trace?: Trace }).trace;
  if (!data) throw new Error('Failed to add trace');
  return data;
}

export async function getTrace(
  client: HelixDBClient,
  id: string
): Promise<Trace | null> {
  const result = await client.query('getTrace', { id });
  return (result as { trace?: Trace }).trace || null;
}

export async function getAllTraces(client: HelixDBClient): Promise<Trace[]> {
  const result = await client.query('getAllTraces', {});
  const data = (result as { traces?: unknown }).traces;
  return normalizeArray<Trace>(data);
}

export async function getTracesByType(
  client: HelixDBClient,
  trace_type: TraceType
): Promise<Trace[]> {
  const result = await client.query('getTracesByType', { trace_type });
  const data = (result as { traces?: unknown }).traces;
  return normalizeArray<Trace>(data);
}

export async function deleteTrace(
  client: HelixDBClient,
  id: string
): Promise<void> {
  await client.query('deleteTrace', { id });
}

// ============================================
// REFERENCE OPERATIONS
// ============================================

export interface AddReferenceParams {
  ref_type: ReferenceType;
  title: string;
  uri?: string;
  retrieved_at?: string;
  snippet?: string;
  full_text?: string;
}

export async function addReference(
  client: HelixDBClient,
  params: AddReferenceParams
): Promise<Reference> {
  const result = await client.query('addReference', {
    ref_type: params.ref_type,
    title: params.title,
    uri: params.uri || '',
    retrieved_at: params.retrieved_at || new Date().toISOString(),
    snippet: params.snippet || '',
    full_text: params.full_text || '',
  });
  const data = (result as { ref?: Reference }).ref;
  if (!data) throw new Error('Failed to add reference');
  return data;
}

export async function getReference(
  client: HelixDBClient,
  id: string
): Promise<Reference | null> {
  const result = await client.query('getReference', { id });
  return (result as { ref?: Reference }).ref || null;
}

export async function getAllReferences(
  client: HelixDBClient
): Promise<Reference[]> {
  const result = await client.query('getAllReferences', {});
  const data = (result as { refs?: unknown }).refs;
  return normalizeArray<Reference>(data);
}

export async function getReferencesByType(
  client: HelixDBClient,
  ref_type: ReferenceType
): Promise<Reference[]> {
  const result = await client.query('getReferencesByType', { ref_type });
  const data = (result as { refs?: unknown }).refs;
  return normalizeArray<Reference>(data);
}

export async function deleteReference(
  client: HelixDBClient,
  id: string
): Promise<void> {
  await client.query('deleteReference', { id });
}

// ============================================
// EDGE OPERATIONS
// ============================================

export async function linkAbout(
  client: HelixDBClient,
  memId: string,
  objectId: string
): Promise<void> {
  await client.query('linkAbout', { memId, objectId });
}

export async function linkInContext(
  client: HelixDBClient,
  memId: string,
  contextId: string
): Promise<void> {
  await client.query('linkInContext', { memId, contextId });
}

export async function linkProposedByAgent(
  client: HelixDBClient,
  memId: string,
  agentId: string
): Promise<void> {
  await client.query('linkProposedByAgent', { memId, agentId });
}

export async function linkVersionOf(
  client: HelixDBClient,
  memId: string,
  objectId: string
): Promise<void> {
  await client.query('linkVersionOf', { memId, objectId });
}

export async function linkHasEvidence(
  client: HelixDBClient,
  memId: string,
  traceId: string
): Promise<void> {
  await client.query('linkHasEvidence', { memId, traceId });
}

export async function linkHasEvidenceRef(
  client: HelixDBClient,
  memId: string,
  refId: string
): Promise<void> {
  await client.query('linkHasEvidenceRef', { memId, refId });
}

export async function linkSupersedes(
  client: HelixDBClient,
  newMemId: string,
  oldMemId: string,
  reason: string
): Promise<void> {
  await client.query('linkSupersedes', { newMemId, oldMemId, reason });
}

export async function linkContradicts(
  client: HelixDBClient,
  memId1: string,
  memId2: string
): Promise<void> {
  await client.query('linkContradicts', { memId1, memId2 });
}

export async function linkDependsOn(
  client: HelixDBClient,
  memId: string,
  dependsOnMemId: string
): Promise<void> {
  await client.query('linkDependsOn', { memId, dependsOnMemId });
}

export async function linkHasCause(
  client: HelixDBClient,
  effectMemId: string,
  causeMemId: string
): Promise<void> {
  await client.query('linkHasCause', { effectMemId, causeMemId });
}

export async function linkHasEffect(
  client: HelixDBClient,
  causeMemId: string,
  effectMemId: string
): Promise<void> {
  await client.query('linkHasEffect', { causeMemId, effectMemId });
}

export async function linkRelated(
  client: HelixDBClient,
  memId1: string,
  memId2: string
): Promise<void> {
  await client.query('linkRelated', { memId1, memId2 });
}

// ============================================
// VECTOR OPERATIONS
// ============================================

export async function addMemEmbedding(
  client: HelixDBClient,
  memId: string,
  status: string,
  createdAt: string,
  embedding: number[]
): Promise<void> {
  await client.query('addMemEmbedding', {
    memId,
    status,
    createdAt,
    embedding,
  });
}

interface HelixVectorResult {
  id: string;
  label: string;
  score: number;
  data?: number[];
  memId?: string;
  status?: string;
  createdAt?: string;
}

export interface MemSearchResult {
  memId: string;
  similarity: number;
  status?: string;
}

export async function searchMems(
  client: HelixDBClient,
  embedding: number[],
  limit: number
): Promise<MemSearchResult[]> {
  const result = await client.query('searchMems', { embedding, limit });
  const data = (result as { results?: unknown }).results;
  if (!data) return [];
  const arr: HelixVectorResult[] = Array.isArray(data) ? data : [data];
  return arr.map((r) => ({
    memId: r.memId || r.id,
    similarity: 1 - r.score, // Helix returns distance, convert to similarity
    status: r.status,
  }));
}

// Reference embedding
export async function addReferenceEmbedding(
  client: HelixDBClient,
  refId: string,
  chunkIndex: number,
  chunkText: string,
  embedding: number[]
): Promise<void> {
  await client.query('addReferenceEmbedding', {
    refId,
    chunkIndex,
    chunkText,
    embedding,
  });
}

interface RefVectorResult {
  id: string;
  score: number;
  refId?: string;
  chunkIndex?: number;
  chunkText?: string;
}

export interface RefSearchResult {
  refId: string;
  chunkIndex: number;
  chunkText: string;
  similarity: number;
}

export async function searchReferences(
  client: HelixDBClient,
  embedding: number[],
  limit: number
): Promise<RefSearchResult[]> {
  const result = await client.query('searchReferences', { embedding, limit });
  const data = (result as { results?: unknown }).results;
  if (!data) return [];
  const arr: RefVectorResult[] = Array.isArray(data) ? data : [data];
  return arr.map((r) => ({
    refId: r.refId || r.id,
    chunkIndex: r.chunkIndex || 0,
    chunkText: r.chunkText || '',
    similarity: 1 - r.score,
  }));
}

// Trace embedding
export async function addTraceEmbedding(
  client: HelixDBClient,
  traceId: string,
  chunkIndex: number,
  chunkText: string,
  embedding: number[]
): Promise<void> {
  await client.query('addTraceEmbedding', {
    traceId,
    chunkIndex,
    chunkText,
    embedding,
  });
}

interface TraceVectorResult {
  id: string;
  score: number;
  traceId?: string;
  chunkIndex?: number;
  chunkText?: string;
}

export interface TraceSearchResult {
  traceId: string;
  chunkIndex: number;
  chunkText: string;
  similarity: number;
}

export async function searchTraces(
  client: HelixDBClient,
  embedding: number[],
  limit: number
): Promise<TraceSearchResult[]> {
  const result = await client.query('searchTraces', { embedding, limit });
  const data = (result as { results?: unknown }).results;
  if (!data) return [];
  const arr: TraceVectorResult[] = Array.isArray(data) ? data : [data];
  return arr.map((r) => ({
    traceId: r.traceId || r.id,
    chunkIndex: r.chunkIndex || 0,
    chunkText: r.chunkText || '',
    similarity: 1 - r.score,
  }));
}

// ============================================
// GRAPH TRAVERSALS
// ============================================

export async function getMemObjects(
  client: HelixDBClient,
  memId: string
): Promise<ObjectEntity[]> {
  const result = await client.query('getMemObjects', { memId });
  const data = (result as { objs?: unknown }).objs;
  return normalizeArray<ObjectEntity>(data);
}

export async function getMemContexts(
  client: HelixDBClient,
  memId: string
): Promise<Context[]> {
  const result = await client.query('getMemContexts', { memId });
  const data = (result as { ctxs?: unknown }).ctxs;
  return normalizeArray<Context>(data);
}

export async function getMemAgents(
  client: HelixDBClient,
  memId: string
): Promise<Agent[]> {
  const result = await client.query('getMemAgents', { memId });
  const data = (result as { agents?: unknown }).agents;
  return normalizeArray<Agent>(data);
}

export async function getMemEvidence(
  client: HelixDBClient,
  memId: string
): Promise<Trace[]> {
  const result = await client.query('getMemEvidence', { memId });
  const data = (result as { traces?: unknown }).traces;
  return normalizeArray<Trace>(data);
}

export async function getMemEvidenceRefs(
  client: HelixDBClient,
  memId: string
): Promise<Reference[]> {
  const result = await client.query('getMemEvidenceRefs', { memId });
  const data = (result as { refs?: unknown }).refs;
  return normalizeArray<Reference>(data);
}

export async function getSupersededBy(
  client: HelixDBClient,
  memId: string
): Promise<Mem[]> {
  const result = await client.query('getSupersededBy', { memId });
  const data = (result as { superseding?: unknown }).superseding;
  return normalizeArray<Mem>(data);
}

export async function getSupersedes(
  client: HelixDBClient,
  memId: string
): Promise<Mem[]> {
  const result = await client.query('getSupersedes', { memId });
  const data = (result as { superseded?: unknown }).superseded;
  return normalizeArray<Mem>(data);
}

export async function getContradictions(
  client: HelixDBClient,
  memId: string
): Promise<Mem[]> {
  const result = await client.query('getContradictions', { memId });
  const data = (result as { contradicting?: unknown }).contradicting;
  return normalizeArray<Mem>(data);
}

export async function getDependencies(
  client: HelixDBClient,
  memId: string
): Promise<Mem[]> {
  const result = await client.query('getDependencies', { memId });
  const data = (result as { deps?: unknown }).deps;
  return normalizeArray<Mem>(data);
}

export async function getDependents(
  client: HelixDBClient,
  memId: string
): Promise<Mem[]> {
  const result = await client.query('getDependents', { memId });
  const data = (result as { dependents?: unknown }).dependents;
  return normalizeArray<Mem>(data);
}

export async function getRelatedMems(
  client: HelixDBClient,
  memId: string
): Promise<Mem[]> {
  const result = await client.query('getRelatedMems', { memId });
  const data = (result as { related?: unknown }).related;
  return normalizeArray<Mem>(data);
}

export async function getObjectVersions(
  client: HelixDBClient,
  objectId: string
): Promise<Mem[]> {
  const result = await client.query('getObjectVersions', { objectId });
  const data = (result as { versions?: unknown }).versions;
  const mems = normalizeArray<Mem>(data);
  return mems.map((m) => ({
    ...m,
    tags: typeof m.tags === 'string' ? (m.tags ? JSON.parse(m.tags) : []) : m.tags,
    actors: typeof m.actors === 'string' ? (m.actors ? JSON.parse(m.actors) : []) : m.actors,
  }));
}
