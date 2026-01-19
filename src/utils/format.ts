/**
 * Shared formatters for consistent CLI output across all commands.
 *
 * Output conventions:
 * - Single entity: "Added <type>:" followed by indented fields
 * - List: "Found N <type>(s):" followed by entries
 * - Each entry: [<subtype>] <name/title> on first line, details indented
 * - ID always shown last in details
 * - Optional fields only shown if present
 */

import type { Mem, ObjectEntity, Context, Agent, Trace, Reference } from '../types/index.js';

// ============================================
// MEM FORMATTERS
// ============================================

export function formatMemSingle(mem: Mem, prefix = 'Added memory'): void {
  console.log(`${prefix}:`);
  console.log(`  id: ${mem.id}`);
  console.log(`  [${mem.mem_type}] ${mem.mem_state}${mem.confidence ? ` (${mem.confidence})` : ''}`);
  console.log(`  ${truncate(mem.statement, 80)}`);
  if (mem.title) console.log(`  title: ${mem.title}`);
  if (mem.tags && mem.tags.length > 0) console.log(`  tags: ${mem.tags.join(', ')}`);
  if (mem.actors && mem.actors.length > 0) console.log(`  actors: ${mem.actors.join(', ')}`);
  console.log(`  status: ${mem.status}`);
}

export function formatMemList(mems: Mem[]): void {
  console.log(`Found ${mems.length} memories:\n`);
  for (const mem of mems) {
    formatMemListItem(mem);
  }
}

export function formatMemListItem(mem: Mem): void {
  console.log(`[${mem.mem_type}] ${mem.mem_state}${mem.confidence ? ` (${mem.confidence})` : ''}`);
  console.log(`  ${truncate(mem.statement, 70)}`);
  if (mem.title) console.log(`  title: ${mem.title}`);
  if (mem.notes) console.log(`  notes: ${truncate(mem.notes, 60)}`);
  console.log(`  id: ${mem.id}`);
  console.log(`  status: ${mem.status} | created: ${mem.created_at}`);
  console.log();
}

export function formatMemSearchResult(mem: Mem, score: number, index: number): void {
  console.log(`${index}. [${mem.mem_type}] ${mem.mem_state}${mem.confidence ? ` (${mem.confidence})` : ''} (score: ${score.toFixed(3)})`);
  console.log(`   ${mem.statement}`);
  if (mem.title) console.log(`   title: ${mem.title}`);
  if (mem.notes) console.log(`   notes: ${truncate(mem.notes, 100)}`);
  console.log(`   id: ${mem.id} | status: ${mem.status}`);
  console.log();
}

// ============================================
// OBJECT FORMATTERS
// ============================================

export function formatObjectSingle(obj: ObjectEntity, prefix = 'Added object'): void {
  console.log(`${prefix}:`);
  console.log(`  id: ${obj.id}`);
  console.log(`  [${obj.object_type}] ${obj.name}`);
  if (obj.reference) console.log(`  ref: ${obj.reference}`);
  if (obj.description) console.log(`  desc: ${obj.description}`);
}

export function formatObjectList(objs: ObjectEntity[]): void {
  console.log(`Found ${objs.length} objects:\n`);
  for (const obj of objs) {
    formatObjectListItem(obj);
  }
}

export function formatObjectListItem(obj: ObjectEntity): void {
  console.log(`[${obj.object_type}] ${obj.name}`);
  if (obj.reference) console.log(`  ref: ${obj.reference}`);
  if (obj.description) console.log(`  desc: ${obj.description}`);
  console.log(`  id: ${obj.id}`);
  console.log();
}

// ============================================
// CONTEXT FORMATTERS
// ============================================

export function formatContextSingle(ctx: Context, prefix = 'Added context'): void {
  console.log(`${prefix}:`);
  console.log(`  id: ${ctx.id}`);
  console.log(`  [${ctx.context_type}] ${ctx.name}`);
  if (ctx.description) console.log(`  desc: ${ctx.description}`);
}

export function formatContextList(ctxs: Context[]): void {
  console.log(`Found ${ctxs.length} contexts:\n`);
  for (const ctx of ctxs) {
    formatContextListItem(ctx);
  }
}

export function formatContextListItem(ctx: Context): void {
  console.log(`[${ctx.context_type}] ${ctx.name}`);
  if (ctx.description) console.log(`  desc: ${ctx.description}`);
  console.log(`  id: ${ctx.id}`);
  console.log();
}

// ============================================
// AGENT FORMATTERS
// ============================================

export function formatAgentSingle(agent: Agent, prefix = 'Added agent'): void {
  console.log(`${prefix}:`);
  console.log(`  id: ${agent.id}`);
  console.log(`  ${agent.name} (${agent.model})`);
  if (agent.function) console.log(`  function: ${agent.function}`);
}

export function formatAgentList(agents: Agent[]): void {
  console.log(`Found ${agents.length} agents:\n`);
  for (const agent of agents) {
    formatAgentListItem(agent);
  }
}

export function formatAgentListItem(agent: Agent): void {
  console.log(`${agent.name} (${agent.model})`);
  if (agent.function) console.log(`  function: ${agent.function}`);
  console.log(`  id: ${agent.id}`);
  console.log();
}

// ============================================
// TRACE FORMATTERS
// ============================================

export function formatTraceSingle(trace: Trace, prefix = 'Added trace'): void {
  console.log(`${prefix}:`);
  console.log(`  id: ${trace.id}`);
  console.log(`  [${trace.trace_type}] ${trace.timestamp}`);
  console.log(`  ${truncate(trace.summary, 80)}`);
}

export function formatTraceList(traces: Trace[]): void {
  console.log(`Found ${traces.length} traces:\n`);
  for (const trace of traces) {
    formatTraceListItem(trace);
  }
}

export function formatTraceListItem(trace: Trace): void {
  console.log(`[${trace.trace_type}] ${trace.id}`);
  console.log(`  ${trace.timestamp}`);
  console.log(`  ${truncate(trace.summary, 60)}`);
  console.log();
}

// ============================================
// REFERENCE FORMATTERS
// ============================================

export function formatReferenceSingle(ref: Reference, prefix = 'Added reference'): void {
  console.log(`${prefix}:`);
  console.log(`  id: ${ref.id}`);
  console.log(`  [${ref.ref_type}] ${ref.title}`);
  if (ref.uri) console.log(`  uri: ${ref.uri}`);
  if (ref.retrieved_at) console.log(`  retrieved: ${ref.retrieved_at}`);
}

export function formatReferenceList(refs: Reference[]): void {
  console.log(`Found ${refs.length} references:\n`);
  for (const ref of refs) {
    formatReferenceListItem(ref);
  }
}

export function formatReferenceListItem(ref: Reference): void {
  console.log(`[${ref.ref_type}] ${ref.title}`);
  if (ref.uri) console.log(`  uri: ${ref.uri}`);
  if (ref.retrieved_at) console.log(`  retrieved: ${ref.retrieved_at}`);
  console.log(`  id: ${ref.id}`);
  console.log();
}

// ============================================
// HELPERS
// ============================================

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '...';
}

/**
 * Format "not found" message consistently
 */
export function formatNotFound(entityType: string, id: string): void {
  console.log(`${entityType} not found: ${id}`);
}

/**
 * Format "none found" message consistently
 */
export function formatNoneFound(entityType: string): void {
  console.log(`No ${entityType} found`);
}
