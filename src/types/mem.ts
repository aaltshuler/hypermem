// MEM - Core memory unit (curated, queryable)

export type MemType =
  | 'decision'
  | 'problem'
  | 'rule'
  | 'bestPractice'
  | 'lexicon'
  | 'trait'
  | 'version';

export type MemState = 'fact' | 'assumption';

export type Confidence = 'low' | 'med' | 'high';

export type MemStatus = 'active' | 'superseded' | 'contested' | 'dimmed';

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
  reality_check?: boolean; // If true, included in reality-check output
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
  reality_check?: boolean; // If true, included in reality-check output
}
