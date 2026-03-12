/**
 * @fileoverview Pure slug generation and validation utilities.
 * These functions have no server/database dependencies and are safe to use in client components.
 *
 * For server-only slug helpers (e.g. uniqueness checks), see slug.server.ts.
 */

/**
 * Converts a text string into a URL-friendly slug.
 * Removes special characters, converts to lowercase, and replaces spaces with hyphens.
 *
 * @param text - The text to convert to a slug
 * @returns URL-friendly slug string
 *
 * @example
 * ```ts
 * generateSlug("Hello World! 2024") // "hello-world-2024"
 * generateSlug("React & TypeScript") // "react-typescript"
 * ```
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}


/**
 * Validates if a slug meets the format requirements.
 *
 * @param slug - The slug to validate
 * @returns true if valid, false otherwise
 *
 * @example
 * ```ts
 * isValidSlug("hello-world") // true
 * isValidSlug("Hello World") // false (uppercase)
 * isValidSlug("hello_world") // false (underscore)
 * ```
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Sanitizes and generates a slug from text, ensuring it's valid.
 * If the input is already a valid slug, returns it as-is.
 *
 * @param text - The text to convert
 * @returns A valid slug
 */
export function sanitizeSlug(text: string): string {
  const slug = generateSlug(text);
  if (!isValidSlug(slug)) {
    throw new Error(`Unable to generate valid slug from: "${text}"`);
  }
  return slug;
}
