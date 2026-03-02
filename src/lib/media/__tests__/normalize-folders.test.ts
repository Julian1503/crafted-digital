import { describe, it, expect } from "vitest";
import { normalizeFolder } from "../normalize-folders";

describe("normalizeFolder", () => {
  it("returns 'general' for null/undefined/empty", () => {
    expect(normalizeFolder(null)).toBe("general");
    expect(normalizeFolder(undefined)).toBe("general");
    expect(normalizeFolder("")).toBe("general");
    expect(normalizeFolder("   ")).toBe("general");
  });

  it("lowercases and trims", () => {
    expect(normalizeFolder("  MyFolder  ")).toBe("myfolder");
  });

  it("normalizes backslashes to forward slashes", () => {
    expect(normalizeFolder("parent\\child")).toBe("parent/child");
  });

  it("collapses multiple slashes", () => {
    expect(normalizeFolder("a///b//c")).toBe("a/b/c");
  });

  it("removes leading and trailing slashes", () => {
    expect(normalizeFolder("/folder/")).toBe("folder");
  });

  it("blocks traversal attempts with ..", () => {
    expect(normalizeFolder("../../../etc")).toBe("etc");
    expect(normalizeFolder("folder/../secret")).toBe("folder/secret");
  });

  it("removes dot segments", () => {
    expect(normalizeFolder("./folder/.")).toBe("folder");
  });

  it("converts spaces to hyphens", () => {
    expect(normalizeFolder("my folder name")).toBe("my-folder-name");
  });

  it("removes unsafe characters", () => {
    expect(normalizeFolder("my@folder!name#")).toBe("myfoldername");
  });

  it("collapses multiple hyphens", () => {
    expect(normalizeFolder("a---b")).toBe("a-b");
  });

  it("returns 'general' when all segments are stripped", () => {
    expect(normalizeFolder("../..")).toBe("general");
    expect(normalizeFolder("@@@@")).toBe("general");
  });

  it("handles nested paths correctly", () => {
    expect(normalizeFolder("projects/web/images")).toBe("projects/web/images");
  });
});
