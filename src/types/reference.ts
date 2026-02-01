// REFERENCE - External sources and artifacts

export type ReferenceType =
  | 'url'
  | 'doc'
  | 'commit'
  | 'pr'
  | 'adr'
  | 'ticket'
  | 'meetingNote';

export interface Reference {
  id: string;
  ref_type: ReferenceType;
  title: string;
  uri?: string;
  retrieved_at?: string;
  snippet?: string;
  full_text?: string; // Full document content for embedding
}

// Input type for creating a new Reference
export interface ReferenceInput {
  ref_type: ReferenceType;
  title: string;
  uri?: string;
  retrieved_at?: string;
  snippet?: string;
  full_text?: string;
}
