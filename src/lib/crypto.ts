import { createHash, randomBytes } from 'crypto';
import { hash, verify } from 'argon2';

// Argon2id password hashing
export async function hashPassword(password: string): Promise<string> {
  // @node-rs/argon2 defaults to argon2id with secure parameters
  return hash(password);
}

export async function verifyPassword(hashed: string, password: string): Promise<boolean> {
  try {
    return await verify(hashed, password);
  } catch {
    return false;
  }
}

// Token generation and hashing
export function generateToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// Helper function to add days to a date
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
