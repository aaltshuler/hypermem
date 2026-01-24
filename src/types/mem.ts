// MEM - Core memory unit (curated, queryable)

export type MemType =
  | 'Decision'
  | 'Problem'
  | 'Rule'
  | 'BestPractice'
  | 'Convention'
  | 'AntiPattern'
  | 'Trait'
  | 'Preference'
  | 'Causal'
  | 'Version';

export type MemState = 'FACT' | 'ASSUMPTION';

export type Confidence = 'low' | 'med' | 'high';

export type MemStatus = 'ACTIVE' | 'SUPERSEDED' | 'CONTESTED' | 'DIMMED';

export type ActorType = 'human' | 'agent';

export interface Mem {
  id: string;
  mem_type: MemType;
  mem_state: MemState;
  confidence?: Confidence; // Only if mem_state is ASSUMPTION
  statement: string;
  status: MemStatus;
  title?: string;
  tags?: string[]; // Stored as JSON string in DB
  notes?: string;
  valid_from?: string;
  valid_to?: string;
  last_validated_at?: string;
  created_at: string;
  actors?: ActorType[]; // Who contributed: human, agent, or both
}

// Input type for creating a new Mem
export interface MemInput {
  mem_type: MemType;
  mem_state?: MemState; // Defaults to FACT
  confidence?: Confidence;
  statement: string;
  status?: MemStatus; // Defaults to ACTIVE
  title?: string;
  tags?: string[];
  notes?: string;
  valid_from?: string;
  valid_to?: string;
  actors?: ActorType[];
}
