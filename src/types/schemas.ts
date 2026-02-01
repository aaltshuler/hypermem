import { z } from 'zod';

// ============================================
// ENUMS
// ============================================

export const MemTypeEnum = z.enum([
  'decision',
  'problem',
  'rule',
  'bestPractice',
  'lexicon',
  'trait',
  'version',
]);

export const MemStateEnum = z.enum(['fact', 'assumption']);

export const ConfidenceEnum = z.enum(['low', 'med', 'high']);

export const MemStatusEnum = z.enum([
  'active',
  'superseded',
  'contested',
  'dimmed',
]);

export const ObjectTypeEnum = z.enum([
  'language',
  'database',
  'framework',
  'lib',
  'tool',
  'api',
  'llm',
  'component',
  'service',
  'font',
  'stack',
  'template',
]);

export const ContextTypeEnum = z.enum(['org', 'project', 'domain', 'stage']);

export const TraceTypeEnum = z.enum([
  'sessionlog',
  'event',
  'snapshot',
  'checkresult',
]);

export const ReferenceTypeEnum = z.enum([
  'url',
  'doc',
  'commit',
  'pr',
  'adr',
  'ticket',
  'meetingNote',
]);

// ============================================
// MEM SCHEMAS
// ============================================

export const MemInputSchema = z
  .object({
    mem_type: MemTypeEnum,
    mem_state: MemStateEnum.default('fact'),
    confidence: ConfidenceEnum.optional(),
    statement: z.string().min(1).max(4000),
    status: MemStatusEnum.default('active'),
    title: z.string().max(200).optional(),
    tags: z.array(z.string()).optional(),
    notes: z.string().max(4000).optional(),
    valid_from: z.string().optional(),
    valid_to: z.string().optional(),
    reality_check: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // If ASSUMPTION, confidence is required
      if (data.mem_state === 'assumption' && !data.confidence) {
        return false;
      }
      return true;
    },
    {
      message: 'Confidence is required when mem_state is ASSUMPTION',
    }
  );

export type MemInputType = z.infer<typeof MemInputSchema>;

// ============================================
// OBJECT SCHEMAS
// ============================================

export const ObjectInputSchema = z.object({
  object_type: ObjectTypeEnum,
  name: z.string().min(1).max(200),
  reference: z.string().max(500).optional(),
  description: z.string().max(2000).optional(),
});

export type ObjectInputType = z.infer<typeof ObjectInputSchema>;

// ============================================
// CONTEXT SCHEMAS
// ============================================

export const ContextInputSchema = z.object({
  context_type: ContextTypeEnum,
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
});

export type ContextInputType = z.infer<typeof ContextInputSchema>;

// ============================================
// AGENT SCHEMAS
// ============================================

export const AgentInputSchema = z.object({
  name: z.string().min(1).max(200),
  model: z.string().min(1).max(200),
  function: z.string().max(500).optional(),
});

export type AgentInputType = z.infer<typeof AgentInputSchema>;

// ============================================
// TRACE SCHEMAS
// ============================================

export const TraceInputSchema = z.object({
  trace_type: TraceTypeEnum,
  timestamp: z.string().optional(),
  summary: z.string().min(1).max(2000),
  payload: z.string().optional(), // JSON blob
});

export type TraceInputType = z.infer<typeof TraceInputSchema>;

// ============================================
// REFERENCE SCHEMAS
// ============================================

export const ReferenceInputSchema = z.object({
  ref_type: ReferenceTypeEnum,
  title: z.string().min(1).max(500),
  uri: z.string().url().optional(),
  retrieved_at: z.string().optional(),
  snippet: z.string().max(2000).optional(),
  full_text: z.string().optional(),
});

export type ReferenceInputType = z.infer<typeof ReferenceInputSchema>;

// ============================================
// SEARCH SCHEMAS
// ============================================

export const SearchQuerySchema = z.object({
  query: z.string().min(1),
  limit: z.number().int().min(1).max(100).default(10),
  status: MemStatusEnum.optional(),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;

// ============================================
// LIST SCHEMAS
// ============================================

export const ListQuerySchema = z.object({
  mem_type: MemTypeEnum.optional(),
  status: MemStatusEnum.optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export type ListQuery = z.infer<typeof ListQuerySchema>;

// ============================================
// LINK SCHEMAS
// ============================================

export const LinkAboutSchema = z.object({
  memId: z.string().uuid(),
  objectId: z.string().uuid(),
});

export const LinkInContextSchema = z.object({
  memId: z.string().uuid(),
  contextId: z.string().uuid(),
});

export const LinkProposedByAgentSchema = z.object({
  memId: z.string().uuid(),
  agentId: z.string().uuid(),
});

export const LinkSupersedesSchema = z.object({
  newMemId: z.string().uuid(),
  oldMemId: z.string().uuid(),
  reason: z.string().max(500),
});

export const LinkRelatedSchema = z.object({
  memId1: z.string().uuid(),
  memId2: z.string().uuid(),
  weight: z.number().min(0).max(1).default(0.5),
});
