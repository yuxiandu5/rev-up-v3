import { createHash, randomBytes } from 'crypto';
import * as argon2 from 'argon2';

// Argon2id password hashing
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: parseInt(process.env.ARGON2_MEMORY || '65536'),
    timeCost: parseInt(process.env.ARGON2_ITERATIONS || '3'),
    parallelism: parseInt(process.env.ARGON2_PARALLELISM || '1'),
  });
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

// Token generation and hashing
export function generateToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

// Helper function to add days to a date
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
