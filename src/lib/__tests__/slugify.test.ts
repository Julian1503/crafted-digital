import { describe, it, expect } from "vitest";
import { generateSlug, isValidSlug, sanitizeSlug } from "../utils/slug";

// ─── generateSlug ────────────────────────────────────────────────────

describe("generateSlug", () => {
  it("converts text to lowercase", () => {
    expect(generateSlug("Hello World")).toBe("hello-world");
  });

  it("replaces spaces with hyphens", () => {
    expect(generateSlug("my blog post")).toBe("my-blog-post");
  });

  it("removes special characters", () => {
    expect(generateSlug("Hello! World?")).toBe("hello-world");
  });

  it("collapses multiple hyphens", () => {
    expect(generateSlug("hello---world")).toBe("hello-world");
  });

  it("trims whitespace", () => {
    expect(generateSlug("  hello world  ")).toBe("hello-world");
  });

  it("collapses multiple spaces", () => {
    expect(generateSlug("hello    world")).toBe("hello-world");
  });

  it("handles empty string", () => {
    expect(generateSlug("")).toBe("");
  });

  it("preserves numbers", () => {
    expect(generateSlug("Hello World! 2024")).toBe("hello-world-2024");
  });

  it("removes ampersands and special chars", () => {
    expect(generateSlug("React & TypeScript")).toBe("react-typescript");
  });

  it("handles complex titles", () => {
    expect(generateSlug("10 Tips & Tricks for Next.js!")).toBe(
      "10-tips-tricks-for-nextjs"
    );
  });

  it("strips leading and trailing hyphens", () => {
    expect(generateSlug("-hello-world-")).toBe("hello-world");
  });

  it("removes underscores (not treated as word chars)", () => {
    expect(generateSlug("hello_world")).toBe("helloworld");
  });

  it("handles non-ASCII characters by removing them", () => {
    expect(generateSlug("café résumé")).toBe("caf-rsum");
  });

  it("handles strings that are only special characters", () => {
    expect(generateSlug("!@#$%")).toBe("");
  });

  it("handles strings that are only spaces", () => {
    expect(generateSlug("   ")).toBe("");
  });
});

// ─── isValidSlug ─────────────────────────────────────────────────────

describe("isValidSlug", () => {
  it("accepts a simple slug", () => {
    expect(isValidSlug("hello-world")).toBe(true);
  });

  it("accepts a single word", () => {
    expect(isValidSlug("hello")).toBe(true);
  });

  it("accepts slugs with numbers", () => {
    expect(isValidSlug("post-2024")).toBe(true);
  });

  it("accepts purely numeric slugs", () => {
    expect(isValidSlug("123")).toBe(true);
  });

  it("rejects uppercase letters", () => {
    expect(isValidSlug("Hello-World")).toBe(false);
  });

  it("rejects underscores", () => {
    expect(isValidSlug("hello_world")).toBe(false);
  });

  it("rejects spaces", () => {
    expect(isValidSlug("hello world")).toBe(false);
  });

  it("rejects leading hyphens", () => {
    expect(isValidSlug("-hello")).toBe(false);
  });

  it("rejects trailing hyphens", () => {
    expect(isValidSlug("hello-")).toBe(false);
  });

  it("rejects consecutive hyphens", () => {
    expect(isValidSlug("hello--world")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidSlug("")).toBe(false);
  });

  it("rejects special characters", () => {
    expect(isValidSlug("hello!world")).toBe(false);
  });
});

// ─── sanitizeSlug ────────────────────────────────────────────────────

describe("sanitizeSlug", () => {
  it("converts valid text to a slug", () => {
    expect(sanitizeSlug("Hello World")).toBe("hello-world");
  });

  it("passes through an already valid slug", () => {
    expect(sanitizeSlug("hello-world")).toBe("hello-world");
  });

  it("strips special characters and produces a valid slug", () => {
    expect(sanitizeSlug("React & TypeScript!")).toBe("react-typescript");
  });

  it("throws when input produces an empty/invalid slug", () => {
    expect(() => sanitizeSlug("")).toThrow("Unable to generate valid slug");
  });

  it("throws for input with only special characters", () => {
    expect(() => sanitizeSlug("!@#$%")).toThrow("Unable to generate valid slug");
  });
});
