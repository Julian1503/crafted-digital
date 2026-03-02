import { describe, it, expect } from "vitest";
import {
  blogPostCreateSchema,
  blogPostUpdateSchema,
} from "../blog.schema";

describe("blogPostCreateSchema", () => {
  it("parses a valid blog post", () => {
    const result = blogPostCreateSchema.safeParse({
      title: "My Post",
      content: "Some content here",
    });
    expect(result.success).toBe(true);
  });

  it("requires title", () => {
    const result = blogPostCreateSchema.safeParse({
      content: "Some content",
    });
    expect(result.success).toBe(false);
  });

  it("requires content", () => {
    const result = blogPostCreateSchema.safeParse({
      title: "My Post",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional fields", () => {
    const result = blogPostCreateSchema.safeParse({
      title: "My Post",
      content: "Some content",
      excerpt: "Short excerpt",
      tags: "news,tech",
      status: "published",
      metaTitle: "SEO Title",
    });
    expect(result.success).toBe(true);
  });

  it("accepts null for nullable fields", () => {
    const result = blogPostCreateSchema.safeParse({
      title: "My Post",
      content: "Some content",
      slug: null,
      excerpt: null,
      coverImage: null,
    });
    expect(result.success).toBe(true);
  });

  it("coerces publishedAt date string", () => {
    const result = blogPostCreateSchema.safeParse({
      title: "My Post",
      content: "Some content",
      publishedAt: "2024-01-15T10:00:00Z",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.publishedAt).toBeInstanceOf(Date);
    }
  });
});

describe("blogPostUpdateSchema", () => {
  it("accepts empty object (all fields optional)", () => {
    const result = blogPostUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts partial updates", () => {
    const result = blogPostUpdateSchema.safeParse({
      title: "Updated Title",
      status: "published",
    });
    expect(result.success).toBe(true);
  });

  it("allows null for publishedAt", () => {
    const result = blogPostUpdateSchema.safeParse({
      publishedAt: null,
    });
    expect(result.success).toBe(true);
  });
});
