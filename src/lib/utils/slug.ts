/**
 * @fileoverview Slug generation and validation utilities.
 * Provides URL-friendly slug creation with best-effort uniqueness checks for database entities.
 *
 * NOTE: The check-then-insert approach in ensureUniqueSlug can still race under concurrent
 * creates/updates. The database unique constraint is the real guarantee of slug uniqueness.
 * Callers should handle unique constraint violations (e.g. with a retry or ConflictError).
 */

import { prisma } from "@/lib/db/prisma";

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
 * Supported entity types for slug uniqueness checks.
 */
export type SlugEntity = "blogPost" | "caseStudy";

/**
 * Ensures a slug is unique for a given entity type by appending a numeric suffix if needed.
 *
 * @param slug - The desired slug
 * @param entity - The entity type ("blogPost" or "caseStudy")
 * @param excludeId - Optional ID to exclude from uniqueness check (for updates)
 * @returns A unique slug, potentially with numeric suffix
 *
 * @example
 * ```ts
 * // If "my-post" exists:
 * await ensureUniqueSlug("my-post", "blogPost") // "my-post-2"
 *
 * // When updating:
 * await ensureUniqueSlug("my-post", "blogPost", "existing-id") // "my-post" (if current record)
 * ```
 */
export async function ensureUniqueSlug(
  slug: string,
  entity: SlugEntity,
  excludeId?: string
): Promise<string> {
  let candidate = slug;
  let counter = 1;

  while (true) {
    const existing = await findBySlug(candidate, entity);

    if (!existing || existing.id === excludeId) {
      return candidate;
    }

    counter++;
    candidate = `${slug}-${counter}`;
  }
}

/**
 * Finds an entity by its slug.
 *
 * @param slug - The slug to search for
 * @param entity - The entity type to search in
 * @returns The found entity or null
 */
async function findBySlug(slug: string, entity: SlugEntity) {
  switch (entity) {
    case "blogPost":
      return prisma.blogPost.findUnique({ where: { slug }, select: { id: true } });
    case "caseStudy":
      return prisma.caseStudy.findUnique({ where: { slug }, select: { id: true } });
    default:
      throw new Error(`Unsupported entity type: ${entity}`);
  }
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
