import * as readline from 'readline';
import { logger } from './logger.js';

/**
 * Common error handler for CLI commands.
 * Logs to debug logger and prints user-friendly message.
 */
export function handleError(error: unknown, context: string): never {
  logger.error(error, context);
  console.error('Error:', error instanceof Error ? error.message : error);
  process.exit(1);
}

/**
 * Output data in JSON or human-readable format.
 */
export function output<T>(
  data: T,
  json: boolean,
  formatter: (data: T) => void
): void {
  if (json) {
    console.log(JSON.stringify(data, null, 2));
  } else {
    formatter(data);
  }
}

/**
 * Prompt for confirmation before destructive action.
 * Returns true if user confirms, false otherwise.
 */
export async function confirmDelete(
  entityType: string,
  id: string,
  force: boolean = false
): Promise<boolean> {
  if (force) return true;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`Delete ${entityType} ${id}? [y/N] `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

/**
 * Validate enum value and print helpful error if invalid.
 */
export function validateEnum<T extends string>(
  value: string,
  enumObj: { safeParse: (v: string) => { success: boolean; data?: T }; options: readonly T[] },
  name: string
): T {
  const result = enumObj.safeParse(value);
  if (!result.success) {
    console.error(`Invalid ${name}: "${value}"`);
    console.error(`Valid options: ${enumObj.options.join(', ')}`);
    process.exit(1);
  }
  return result.data!;
}
