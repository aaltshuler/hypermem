// OBJECT - Things memories are about

export type ObjectType =
  | 'Language'
  | 'Database'
  | 'Framework'
  | 'Lib'
  | 'Tool'
  | 'API'
  | 'Model'
  | 'Component'
  | 'Service'
  | 'Font'
  | 'Stack'
  | 'Template';

export interface ObjectEntity {
  id: string;
  object_type: ObjectType;
  name: string;
  reference?: string; // External ID (e.g., gpt-5.1, claude-opus-4-1)
  description?: string;
}

// Input type for creating a new Object
export interface ObjectInput {
  object_type: ObjectType;
  name: string;
  reference?: string;
  description?: string;
}
