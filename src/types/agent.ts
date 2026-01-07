// AGENT - AI agent instances

export interface Agent {
  id: string;
  name: string;
  model: string; // e.g., "gpt-5.2-2025-12-11", "claude-opus-4-5-20251101"
  function: string; // Agent's purpose/role
}

// Input type for creating a new Agent
export interface AgentInput {
  name: string;
  model: string;
  function?: string;
}
