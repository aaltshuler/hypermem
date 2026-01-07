import { createOpenAI } from '@ai-sdk/openai';

// Initialize OpenAI provider
export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Model constants
export const MODEL = 'gpt-5.2-2025-12-11';
export const EMBEDDING_MODEL = 'text-embedding-3-large';
