import { ZodSchema, ZodError } from 'zod';

/**
 * Validate input against a Zod schema.
 * On failure, prints formatted error and exits with code 1.
 */
export function validate<T>(schema: ZodSchema<T>, data: unknown, context: string): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = error.issues
        .map((i) => `  • ${i.path.length ? i.path.join('.') + ': ' : ''}${i.message}`)
        .join('\n');
      console.error(`Invalid ${context}:\n${issues}`);
      process.exit(1);
    }
    throw error;
  }
}

/**
 * Parse integer with validation.
 * For use with Commander's .argParser()
 */
export function parseIntArg(value: string, name: string): number {
  const n = parseInt(value, 10);
  if (isNaN(n)) {
    console.error(`Error: ${name} must be a number, got "${value}"`);
    process.exit(1);
  }
  return n;
}

/**
 * Parse positive integer with validation.
 * For use with Commander's .argParser()
 */
export function parsePositiveInt(value: string, name: string): number {
  const n = parseIntArg(value, name);
  if (n < 1) {
    console.error(`Error: ${name} must be positive, got ${n}`);
    process.exit(1);
  }
  return n;
}
