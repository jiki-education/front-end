import { describe, it, expect } from "vitest";
import { levels, getLevel, hasLevel, getLevelIds } from "../../src/levels";

describe("Level Registry", () => {
  describe("levels array", () => {
    it("should contain using-functions level", () => {
      expect(levels[0]).toBeDefined();
      expect(levels[0].id).toBe("using-functions");
    });

    it("should contain fundamentals level", () => {
      expect(levels[1]).toBeDefined();
      expect(levels[1].id).toBe("fundamentals");
    });

    it("should contain variables level", () => {
      expect(levels[2]).toBeDefined();
      expect(levels[2].id).toBe("variables");
    });
  });

  describe("getLevel", () => {
    it("should return using-functions level when requested", () => {
      const level = getLevel("using-functions")!;
      expect(level.id).toBe("using-functions");
      expect(level.title).toBe("Using Functions");
      expect(level.description).toContain("functions");
    });

    it("should return fundamentals level when requested", () => {
      const level = getLevel("fundamentals")!;
      expect(level.id).toBe("fundamentals");
      expect(level.title).toBe("Programming Fundamentals");
      expect(level.description).toContain("function calls");
    });

    it("should return variables level when requested", () => {
      const level = getLevel("variables")!;
      expect(level.id).toBe("variables");
      expect(level.title).toBe("Variables and Assignments");
      expect(level.description).toContain("declare variables");
    });

    it("should return undefined for invalid level ID", () => {
      const level = getLevel("invalid-level");
      expect(level).toBeUndefined();
    });

    it("should return the same object reference from registry", () => {
      const level1 = getLevel("fundamentals")!;
      const level2 = getLevel("fundamentals")!;
      expect(level1).toBe(level2); // Same reference
    });
  });

  describe("hasLevel", () => {
    it("should return true for existing levels", () => {
      expect(hasLevel("using-functions")).toBe(true);
      expect(hasLevel("fundamentals")).toBe(true);
      expect(hasLevel("variables")).toBe(true);
    });

    it("should return false for non-existent levels", () => {
      expect(hasLevel("advanced")).toBe(false);
      expect(hasLevel("expert")).toBe(false);
      expect(hasLevel("")).toBe(false);
    });

    it("should work with any string", () => {
      const testId: string = "fundamentals";
      if (hasLevel(testId)) {
        const level = getLevel(testId);
        expect(level).toBeDefined();
      }
    });
  });

  describe("getLevelIds", () => {
    it("should return array of all level IDs", () => {
      const ids = getLevelIds();
      expect(ids).toContain("fundamentals");
      expect(ids).toContain("variables");
      expect(ids.length).toBeGreaterThanOrEqual(2);
    });

    it("should return IDs in definition order", () => {
      const ids = getLevelIds();
      expect(ids[0]).toBe("using-functions");
      expect(ids[1]).toBe("fundamentals");
      expect(ids[2]).toBe("variables");
    });

    it("should return array of proper LevelId type", () => {
      const ids = getLevelIds();
      ids.forEach((id) => {
        // Should be able to use each ID with getLevel without type errors
        const level = getLevel(id)!;
        expect(level).toBeDefined();
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
        expect(level).toHaveProperty("languageFeatures");
        expect(typeof level.id).toBe("string");
        expect(typeof level.title).toBe("string");
        expect(level.id).toBe(id); // ID should match registry key
      });
    });

    it("all levels should have at least one language configured", () => {
      const ids = getLevelIds();
      ids.forEach((id) => {
        const level = getLevel(id)!;
        const hasJS = level.languageFeatures.javascript !== undefined;
        const hasPython = level.languageFeatures.python !== undefined;
        expect(hasJS || hasPython).toBe(true);
      });
    });
  });
});
