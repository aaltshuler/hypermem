// TRACE - Internal records produced by the system

export type TraceType = 'sessionlog' | 'event' | 'snapshot' | 'checkresult';

export interface Trace {
  id: string;
  trace_type: TraceType;
  timestamp: string;
  summary: string;
  payload?: string; // JSON blob
}

// Input type for creating a new Trace
export interface TraceInput {
  trace_type: TraceType;
  timestamp?: string; // Defaults to now
  summary: string;
  payload?: string;
}
