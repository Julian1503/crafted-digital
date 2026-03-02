import { describe, it, expect } from "vitest";
import { roleSchema } from "../roles.schema";
import { contentBlockSchema } from "../content-blocks.schema";
import { mediaAssetSchema } from "../media-assets.schema";
import { integrationSchema } from "../integrations.schema";
import { siteSettingSchema } from "../site-settings.schema";
import { loginSchema } from "../auth.schema";
import { caseStudyCreateSchema } from "../case-studies.schema";

describe("loginSchema", () => {
  it("parses valid login", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "mypassword",
    });
    expect(result.success).toBe(true);
  });

  it("requires valid email", () => {
    expect(loginSchema.safeParse({ email: "bad", password: "x" }).success).toBe(false);
  });

  it("requires password", () => {
    expect(loginSchema.safeParse({ email: "a@b.com" }).success).toBe(false);
  });
});

describe("roleSchema", () => {
  it("parses a valid role", () => {
    const result = roleSchema.safeParse({ name: "editor" });
    expect(result.success).toBe(true);
  });

  it("requires name", () => {
    expect(roleSchema.safeParse({}).success).toBe(false);
  });

  it("accepts optional permissionIds", () => {
    const result = roleSchema.safeParse({
      name: "admin",
      permissionIds: ["p1", "p2"],
    });
    expect(result.success).toBe(true);
  });
});

describe("contentBlockSchema", () => {
  it("parses a valid content block", () => {
    const result = contentBlockSchema.safeParse({ section: "hero" });
    expect(result.success).toBe(true);
  });

  it("requires section", () => {
    expect(contentBlockSchema.safeParse({}).success).toBe(false);
  });

  it("accepts optional fields", () => {
    const result = contentBlockSchema.safeParse({
      section: "hero",
      title: "Welcome",
      content: "Hello world",
      sortOrder: 1,
      active: true,
    });
    expect(result.success).toBe(true);
  });
});

describe("mediaAssetSchema", () => {
  it("parses a valid media asset", () => {
    const result = mediaAssetSchema.safeParse({
      url: "https://example.com/image.png",
      filename: "image.png",
      mimeType: "image/png",
    });
    expect(result.success).toBe(true);
  });

  it("requires url, filename, mimeType", () => {
    expect(mediaAssetSchema.safeParse({}).success).toBe(false);
    expect(mediaAssetSchema.safeParse({ url: "https://x.com/a.png" }).success).toBe(false);
  });

  it("validates url format", () => {
    const result = mediaAssetSchema.safeParse({
      url: "not-a-url",
      filename: "image.png",
      mimeType: "image/png",
    });
    expect(result.success).toBe(false);
  });
});

describe("integrationSchema", () => {
  it("accepts partial fields", () => {
    const result = integrationSchema.safeParse({ enabled: true });
    expect(result.success).toBe(true);
  });

  it("accepts empty object", () => {
    expect(integrationSchema.safeParse({}).success).toBe(true);
  });
});

describe("siteSettingSchema", () => {
  it("parses a valid setting", () => {
    const result = siteSettingSchema.safeParse({
      key: "site_name",
      value: "My Site",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.group).toBe("general");
    }
  });

  it("requires key and value", () => {
    expect(siteSettingSchema.safeParse({}).success).toBe(false);
    expect(siteSettingSchema.safeParse({ key: "k" }).success).toBe(false);
  });
});

describe("caseStudyCreateSchema", () => {
  it("parses a valid case study", () => {
    const result = caseStudyCreateSchema.safeParse({
      title: "Project X",
      body: "Detailed case study content",
    });
    expect(result.success).toBe(true);
  });

  it("requires title and body", () => {
    expect(caseStudyCreateSchema.safeParse({ title: "X" }).success).toBe(false);
    expect(caseStudyCreateSchema.safeParse({ body: "Y" }).success).toBe(false);
  });

  it("accepts optional featured flag", () => {
    const result = caseStudyCreateSchema.safeParse({
      title: "Project",
      body: "Content",
      featured: true,
    });
    expect(result.success).toBe(true);
  });
});
