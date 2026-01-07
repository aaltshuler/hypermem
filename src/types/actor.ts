// ACTOR - Who created/proposed

export type ActorType = 'Person' | 'Agent';

export interface Actor {
  id: string;
  actor_type: ActorType;
  name: string;
}

// Input type for creating a new Actor
export interface ActorInput {
  actor_type: ActorType;
  name: string;
}
