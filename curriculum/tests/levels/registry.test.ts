import { describe, it, expect } from "vitest";
import { levels, getLevel, hasLevel, getLevelIds } from "../../src/levels";

describe("Level Registry", () => {
  describe("levels array", () => {
    it("should contain all expected levels in order", () => {
      const ids = levels.map((l) => l.id);
      expect(ids).toEqual([
        "using-functions",
        "strings-and-colors",
        "repeat-loop",
        "variables",
        "basic-state",
        "functions-that-return-things",
        "conditionals",
        "complex-conditionals",
        "conditionals-and-state",
        "make-your-own-functions",
        "adding-inputs-to-your-functions",
        "adding-returns-to-your-functions",
        "string-manipulation",
        "string-iteration",
        "methods-and-properties",
        "lists",
        "dictionaries",
        "multiple-functions",
        "everything"
      ]);
    });
  });

  describe("getLevel", () => {
    it("should return using-functions level when requested", () => {
      const level = getLevel("using-functions")!;
      expect(level.id).toBe("using-functions");
      expect(level.title).toBe("Using Functions");
    });

    it("should return variables level when requested", () => {
      const level = getLevel("variables")!;
      expect(level.id).toBe("variables");
      expect(level.title).toBe("Variables");
    });

    it("should return undefined for invalid level ID", () => {
      const level = getLevel("invalid-level");
      expect(level).toBeUndefined();
    });

    it("should return the same object reference from registry", () => {
      const level1 = getLevel("variables")!;
      const level2 = getLevel("variables")!;
      expect(level1).toBe(level2);
    });
  });

  describe("hasLevel", () => {
    it("should return true for existing levels", () => {
      expect(hasLevel("using-functions")).toBe(true);
      expect(hasLevel("variables")).toBe(true);
      expect(hasLevel("conditionals")).toBe(true);
      expect(hasLevel("everything")).toBe(true);
    });

    it("should return false for non-existent levels", () => {
      expect(hasLevel("fundamentals")).toBe(false);
      expect(hasLevel("advanced")).toBe(false);
      expect(hasLevel("")).toBe(false);
    });
  });

  describe("getLevelIds", () => {
    it("should return array of all level IDs", () => {
      const ids = getLevelIds();
      expect(ids).toContain("using-functions");
      expect(ids).toContain("variables");
      expect(ids).toContain("everything");
      expect(ids.length).toBe(19);
    });

    it("should return IDs in definition order", () => {
      const ids = getLevelIds();
      expect(ids[0]).toBe("using-functions");
      expect(ids[1]).toBe("strings-and-colors");
      expect(ids[2]).toBe("repeat-loop");
      expect(ids[3]).toBe("variables");
      expect(ids[ids.length - 1]).toBe("everything");
    });

    it("every ID should resolve to a level", () => {
      const ids = getLevelIds();
      ids.forEach((id) => {
        const level = getLevel(id)!;
        expect(level).toBeDefined();
        expect(level.id).toBe(id);
      });
    });
  });

  describe("level structure validation", () => {
    it("all levels should have required properties", () => {
      const ids = getLevelIds();
      ids.forEach((id) => {
        const level = getLevel(id)!;
        expect(level).toHaveProperty("id");
        expect(level).toHaveProperty("title");
        expect(level).toHaveProperty("description");
        expect(level).toHaveProperty("languageFeatures");
        expect(typeof level.id).toBe("string");
        expect(typeof level.title).toBe("string");
      });
    });

    it("all levels should have JavaScript configured", () => {
      const ids = getLevelIds();
      ids.forEach((id) => {
        const level = getLevel(id)!;
        expect(level.languageFeatures.javascript).toBeDefined();
      });
    });
  });
});
