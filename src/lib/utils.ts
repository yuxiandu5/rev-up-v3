import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")        // spaces & underscores → dash
    .replace(/[^a-z0-9-]/g, "")     // remove all non-alphanumeric except dash
    .replace(/--+/g, "-")           // collapse multiple dashes
    .replace(/^-+|-+$/g, "");       // trim leading/trailing dashes
}
