// CONTEXT - Where memories apply

export type ContextType = 'org' | 'project' | 'domain' | 'stage';

export interface Context {
  id: string;
  context_type: ContextType;
  name: string;
  description?: string;
}

// Input type for creating a new Context
export interface ContextInput {
  context_type: ContextType;
  name: string;
  description?: string;
}
