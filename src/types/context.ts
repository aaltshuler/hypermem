// CONTEXT - Where memories apply

export type ContextType = 'Org' | 'Project';

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
