import { z } from 'zod';

const ConfigSchema = z.object({
  openaiApiKey: z.string().min(1),
  helixUrl: z.string().url().default('http://localhost:6969'),
  logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
});

export type Config = z.infer<typeof ConfigSchema>;

export function loadConfig(): Config {
  return ConfigSchema.parse({
    openaiApiKey: process.env.OPENAI_API_KEY,
    helixUrl: process.env.HELIX_URL,
    logLevel: process.env.LOG_LEVEL,
    nodeEnv: process.env.NODE_ENV,
  });
}

export const config = loadConfig();
