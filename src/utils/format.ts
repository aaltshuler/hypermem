/**
 * CLI formatters with chalk colorization.
 * Chalk auto-detects TTY: colors in terminal, plain when piped.
 */

import chalk from 'chalk';
import type { Mem, ObjectEntity, Context, Agent, Trace, Reference } from '../types/index.js';

// Color scheme
const c = {
  type: chalk.cyan.bold,
  state: chalk.yellow,
  status: (s: string) => {
    switch (s) {
      case 'ACTIVE': return chalk.green(s);
      case 'SUPERSEDED': return chalk.gray(s);
      case 'CONTESTED': return chalk.red(s);
      case 'DIMMED': return chalk.dim(s);
      default: return s;
    }
  },
  id: chalk.dim.gray,
  label: chalk.gray,
  value: chalk.white,
  title: chalk.bold,
  score: chalk.magenta,
  count: chalk.green.bold,
  index: chalk.cyan,
};

// ============================================
// MEM FORMATTERS
// ============================================

export function formatMemSingle(mem: Mem, prefix = 'Added memory'): void {
  console.log(`${chalk.green('✓')} ${prefix}:`);
  console.log(`  ${c.label('id:')} ${c.id(mem.id)}`);
  console.log(`  ${c.type(`[${mem.mem_type}]`)} ${c.state(mem.mem_state)}${mem.confidence ? c.label(` (${mem.confidence})`) : ''}`);
  console.log(`  ${c.value(truncate(mem.statement, 200))}`);
  if (mem.title) console.log(`  ${c.label('title:')} ${c.title(mem.title)}`);
  if (mem.tags && mem.tags.length > 0) console.log(`  ${c.label('tags:')} ${mem.tags.join(', ')}`);
  if (mem.actors && mem.actors.length > 0) console.log(`  ${c.label('actors:')} ${mem.actors.join(', ')}`);
  console.log(`  ${c.label('status:')} ${c.status(mem.status)}`);
}

export function formatMemList(mems: Mem[]): void {
  console.log(`Found ${c.count(mems.length.toString())} memories:\n`);
  for (const mem of mems) {
    formatMemListItem(mem);
  }
}

function formatMemListItem(mem: Mem): void {
  console.log(`${c.type(`[${mem.mem_type}]`)} ${c.state(mem.mem_state)}${mem.confidence ? c.label(` (${mem.confidence})`) : ''}`);
  console.log(`  ${c.value(truncate(mem.statement, 200))}`);
  if (mem.title) console.log(`  ${c.label('title:')} ${c.title(mem.title)}`);
  if (mem.notes) console.log(`  ${c.label('notes:')} ${truncate(mem.notes, 200)}`);
  console.log(`  ${c.id(mem.id)}`);
  console.log(`  ${c.status(mem.status)} ${c.label('|')} ${c.label('created:')} ${dateOnly(mem.created_at)}`);
  console.log();
}

export function formatMemSearchResult(mem: Mem, score: number, index: number): void {
  console.log(`${c.index(`${index}.`)} ${c.type(`[${mem.mem_type}]`)} ${c.state(mem.mem_state)}${mem.confidence ? c.label(` (${mem.confidence})`) : ''} ${c.label('score:')} ${c.score(score.toFixed(3))}`);
  console.log(`   ${c.value(mem.statement)}`);
  if (mem.title) console.log(`   ${c.label('title:')} ${c.title(mem.title)}`);
  if (mem.notes) console.log(`   ${c.label('notes:')} ${truncate(mem.notes, 200)}`);
  console.log(`   ${c.id(mem.id)} ${c.label('|')} ${c.status(mem.status)}`);
  console.log();
}

// ============================================
// OBJECT FORMATTERS
// ============================================

export function formatObjectSingle(obj: ObjectEntity, prefix = 'Added object'): void {
  console.log(`${chalk.green('✓')} ${prefix}:`);
  console.log(`  ${c.label('id:')} ${c.id(obj.id)}`);
  console.log(`  ${c.type(`[${obj.object_type}]`)} ${c.title(obj.name)}`);
  if (obj.reference) console.log(`  ${c.label('ref:')} ${obj.reference}`);
  if (obj.description) console.log(`  ${c.label('desc:')} ${obj.description}`);
}

export function formatObjectList(objs: ObjectEntity[]): void {
  console.log(`Found ${c.count(objs.length.toString())} objects:\n`);
  for (const obj of objs) {
    formatObjectListItem(obj);
  }
}

function formatObjectListItem(obj: ObjectEntity): void {
  console.log(`${c.type(`[${obj.object_type}]`)} ${c.title(obj.name)}`);
  if (obj.reference) console.log(`  ${c.label('ref:')} ${obj.reference}`);
  if (obj.description) console.log(`  ${c.label('desc:')} ${obj.description}`);
  console.log(`  ${c.id(obj.id)}`);
  console.log();
}

// ============================================
// CONTEXT FORMATTERS
// ============================================

export function formatContextSingle(ctx: Context, prefix = 'Added context'): void {
  console.log(`${chalk.green('✓')} ${prefix}:`);
  console.log(`  ${c.label('id:')} ${c.id(ctx.id)}`);
  console.log(`  ${c.type(`[${ctx.context_type}]`)} ${c.title(ctx.name)}`);
  if (ctx.description) console.log(`  ${c.label('desc:')} ${ctx.description}`);
}

export function formatContextList(ctxs: Context[]): void {
  console.log(`Found ${c.count(ctxs.length.toString())} contexts:\n`);
  for (const ctx of ctxs) {
    formatContextListItem(ctx);
  }
}

function formatContextListItem(ctx: Context): void {
  console.log(`${c.type(`[${ctx.context_type}]`)} ${c.title(ctx.name)}`);
  if (ctx.description) console.log(`  ${c.label('desc:')} ${ctx.description}`);
  console.log(`  ${c.id(ctx.id)}`);
  console.log();
}

// ============================================
// AGENT FORMATTERS
// ============================================

export function formatAgentSingle(agent: Agent, prefix = 'Added agent'): void {
  console.log(`${chalk.green('✓')} ${prefix}:`);
  console.log(`  ${c.label('id:')} ${c.id(agent.id)}`);
  console.log(`  ${c.title(agent.name)} ${c.label(`(${agent.model})`)}`);
  if (agent.function) console.log(`  ${c.label('function:')} ${agent.function}`);
}

export function formatAgentList(agents: Agent[]): void {
  console.log(`Found ${c.count(agents.length.toString())} agents:\n`);
  for (const agent of agents) {
    formatAgentListItem(agent);
  }
}

function formatAgentListItem(agent: Agent): void {
  console.log(`${c.title(agent.name)} ${c.label(`(${agent.model})`)}`);
  if (agent.function) console.log(`  ${c.label('function:')} ${agent.function}`);
  console.log(`  ${c.id(agent.id)}`);
  console.log();
}

// ============================================
// TRACE FORMATTERS
// ============================================

export function formatTraceSingle(trace: Trace, prefix = 'Added trace'): void {
  console.log(`${chalk.green('✓')} ${prefix}:`);
  console.log(`  ${c.label('id:')} ${c.id(trace.id)}`);
  console.log(`  ${c.type(`[${trace.trace_type}]`)} ${c.label(dateOnly(trace.timestamp))}`);
  console.log(`  ${c.value(truncate(trace.summary, 200))}`);
}

export function formatTraceList(traces: Trace[]): void {
  console.log(`Found ${c.count(traces.length.toString())} traces:\n`);
  for (const trace of traces) {
    formatTraceListItem(trace);
  }
}

function formatTraceListItem(trace: Trace): void {
  console.log(`${c.type(`[${trace.trace_type}]`)} ${c.id(trace.id)}`);
  console.log(`  ${c.label(dateOnly(trace.timestamp))}`);
  console.log(`  ${c.value(truncate(trace.summary, 200))}`);
  console.log();
}

// ============================================
// REFERENCE FORMATTERS
// ============================================

export function formatReferenceSingle(ref: Reference, prefix = 'Added reference'): void {
  console.log(`${chalk.green('✓')} ${prefix}:`);
  console.log(`  ${c.label('id:')} ${c.id(ref.id)}`);
  console.log(`  ${c.type(`[${ref.ref_type}]`)} ${c.title(ref.title)}`);
  if (ref.uri) console.log(`  ${c.label('uri:')} ${chalk.blue.underline(ref.uri)}`);
  if (ref.retrieved_at) console.log(`  ${c.label('retrieved:')} ${dateOnly(ref.retrieved_at)}`);
}

export function formatReferenceList(refs: Reference[]): void {
  console.log(`Found ${c.count(refs.length.toString())} references:\n`);
  for (const ref of refs) {
    formatReferenceListItem(ref);
  }
}

function formatReferenceListItem(ref: Reference): void {
  console.log(`${c.type(`[${ref.ref_type}]`)} ${c.title(ref.title)}`);
  if (ref.uri) console.log(`  ${c.label('uri:')} ${chalk.blue.underline(ref.uri)}`);
  if (ref.retrieved_at) console.log(`  ${c.label('retrieved:')} ${dateOnly(ref.retrieved_at)}`);
  console.log(`  ${c.id(ref.id)}`);
  console.log();
}

// ============================================
// HELPERS
// ============================================

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '...';
}

function dateOnly(timestamp: string): string {
  return timestamp.split('T')[0];
}

export function formatNotFound(entityType: string, id: string): void {
  console.log(`${chalk.red('✗')} ${entityType} not found: ${c.id(id)}`);
}

export function formatNoneFound(entityType: string): void {
  console.log(`${chalk.yellow('○')} No ${entityType} found`);
}
