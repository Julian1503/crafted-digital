/**
 * @fileoverview Server-only slug helpers that depend on the database.
 * Provides best-effort uniqueness checks for slug generation.
 *
 * NOTE: The check-then-insert approach in ensureUniqueSlug can still race under concurrent
 * creates/updates. The database unique constraint is the real guarantee of slug uniqueness.
 * Callers should handle unique constraint violations (e.g. with a retry or ConflictError).
 */

import "server-only";
import { prisma } from "@/lib/db/prisma";

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

