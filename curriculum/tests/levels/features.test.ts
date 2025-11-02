import { describe, it, expect } from "vitest";
import {
  getAllowedNodes,
  getFeatureFlags,
  getLanguageFeatures,
  type JavaScriptFeatureFlags,
  type PythonFeatureFlags
} from "../../src/levels";

describe("Language Features", () => {
  describe("getAllowedNodes", () => {
    it("should return allowed nodes for JavaScript fundamentals", () => {
      const nodes = getAllowedNodes("fundamentals", "javascript");
      expect(nodes).toBeDefined();
      expect(nodes).toContain("LiteralExpression");
      expect(nodes).toContain("IdentifierExpression");
      expect(nodes).not.toContain("ForStatement");
      expect(nodes).not.toContain("IfStatement");
    });

    it("should return allowed nodes for JavaScript variables", () => {
      const nodes = getAllowedNodes("variables", "javascript");
      expect(nodes).toBeDefined();
      expect(nodes).toContain("VariableDeclaration");
      expect(nodes).toContain("AssignmentExpression");
      expect(nodes).toContain("BinaryExpression");
      // Should also include everything from fundamentals
      expect(nodes).toContain("LiteralExpression");
      expect(nodes).toContain("IdentifierExpression");
    });

    it("should return allowed nodes for Python fundamentals", () => {
      const nodes = getAllowedNodes("fundamentals", "python");
      expect(nodes).toBeDefined();
      expect(nodes).toContain("LiteralExpression");
      expect(nodes).toContain("IdentifierExpression");
      expect(nodes).not.toContain("IfStatement");
    });

    it("should return allowed nodes for Python variables", () => {
      const nodes = getAllowedNodes("variables", "python");
      expect(nodes).toBeDefined();
      expect(nodes).toContain("AssignmentStatement");
      expect(nodes).toContain("BinaryExpression");
      expect(nodes).toContain("UnaryExpression");
      // Should also include fundamentals
      expect(nodes).toContain("LiteralExpression");
      expect(nodes).toContain("IdentifierExpression");
    });

    it("should return undefined for unconfigured language", () => {
      // @ts-expect-error Testing invalid language
      const nodes = getAllowedNodes("fundamentals", "ruby");
      expect(nodes).toBeUndefined();
    });

    it("should use proper TypeScript types", () => {
      const jsNodes = getAllowedNodes("fundamentals", "javascript");
      if (jsNodes) {
        // These should be valid NodeType values from interpreters
        const validNodes = ["LiteralExpression", "IdentifierExpression"];
        validNodes.forEach((node) => {
          expect(jsNodes).toContain(node);
        });
      }

      // Python tests will be added when NodeType is defined in interpreters
    });
  });

  describe("getFeatureFlags", () => {
    it("should return language features for JavaScript fundamentals", () => {
      const flags = getFeatureFlags("fundamentals", "javascript") as JavaScriptFeatureFlags;
      expect(flags.allowTruthiness).toBe(false);
      expect(flags.allowTypeCoercion).toBe(false);
      expect(flags.enforceStrictEquality).toBe(true);
      expect(flags.allowShadowing).toBe(false);
    });

    it("should return language features for JavaScript variables", () => {
      const flags = getFeatureFlags("variables", "javascript") as JavaScriptFeatureFlags;
      expect(flags.requireVariableInstantiation).toBe(true);
      expect(flags.allowShadowing).toBe(false);
    });

    it("should return language features for Python fundamentals", () => {
      const flags = getFeatureFlags("fundamentals", "python") as PythonFeatureFlags;
      expect(flags.allowTruthiness).toBe(false);
      expect(flags.allowTypeCoercion).toBe(false);
    });

    it("should return empty object for unconfigured language", () => {
      // @ts-expect-error Testing invalid language
      const flags = getFeatureFlags("fundamentals", "ruby");
      expect(flags).toEqual({});
    });
  });

  describe("getLanguageFeatures", () => {
    it("should combine allowed nodes and feature flags for JavaScript", () => {
      const features = getLanguageFeatures("fundamentals", "javascript");

      // Should have allowedNodes
      expect(features.allowedNodes).toBeDefined();
      expect(features.allowedNodes).toContain("LiteralExpression");

      // Should have feature flags
      expect(features.allowTruthiness).toBe(false);
      expect(features.allowTypeCoercion).toBe(false);
      expect(features.enforceStrictEquality).toBe(true);
    });

    it("should return empty object for unconfigured level/language", () => {
      // Testing invalid level (now accepted as string)
      const features = getLanguageFeatures("invalid", "javascript");
      expect(features).toEqual({});
    });

    it("should return proper shape for interpreter consumption", () => {
      const features = getLanguageFeatures("variables", "javascript");

      // Check that it has the shape expected by interpreters
      expect(features).toHaveProperty("allowedNodes");
      expect(Array.isArray(features.allowedNodes)).toBe(true);

      // Check feature flags are present
      expect(typeof features.allowShadowing).toBe("boolean");
      expect(typeof features.requireVariableInstantiation).toBe("boolean");
    });

    it("should handle levels with partial feature configuration", () => {
      const fundamentals = getLanguageFeatures("fundamentals", "javascript");
      const variables = getLanguageFeatures("variables", "javascript");

      // Both should have some feature flags
      expect(fundamentals.allowTruthiness).toBeDefined();
      expect(variables.requireVariableInstantiation).toBeDefined();

      // Variables should have more allowed nodes
      expect(variables.allowedNodes!.length).toBeGreaterThan(fundamentals.allowedNodes!.length);
    });
  });

  describe("progressive feature enablement", () => {
    it("variables level should include all fundamentals nodes plus more", () => {
      const fundamentalNodes = getAllowedNodes("fundamentals", "javascript") || [];
      const variableNodes = getAllowedNodes("variables", "javascript") || [];

      // All fundamental nodes should be in variables
      fundamentalNodes.forEach((node) => {
        expect(variableNodes).toContain(node);
      });

      // Variables should have additional nodes
      expect(variableNodes.length).toBeGreaterThan(fundamentalNodes.length);
      expect(variableNodes).toContain("VariableDeclaration");
    });

    it("feature flags should remain consistent or become more permissive", () => {
      const fundamentalFlags = getFeatureFlags("fundamentals", "javascript") as JavaScriptFeatureFlags;
      const variableFlags = getFeatureFlags("variables", "javascript") as JavaScriptFeatureFlags;

      // Strict equality should remain enforced
      expect(fundamentalFlags.enforceStrictEquality).toBe(true);
      expect(variableFlags.enforceStrictEquality).toBe(true);

      // Truthiness should remain disabled in early levels
      expect(fundamentalFlags.allowTruthiness).toBe(false);
      expect(variableFlags.allowTruthiness).toBe(false);
    });
  });

  describe("getLanguageFeatures - accumulation", () => {
    it("should accumulate nodes from all previous levels", () => {
      const features = getLanguageFeatures("variables", "javascript");

      // Should have nodes from both fundamentals and variables
      expect(features.allowedNodes).toContain("LiteralExpression"); // from fundamentals
      expect(features.allowedNodes).toContain("IdentifierExpression"); // from fundamentals
      expect(features.allowedNodes).toContain("VariableDeclaration"); // from variables
      expect(features.allowedNodes).toContain("AssignmentExpression"); // from variables
    });

    it("should not duplicate nodes", () => {
      const features = getLanguageFeatures("variables", "javascript");
      const literalCount = features.allowedNodes?.filter((n) => n === "LiteralExpression").length ?? 0;
      expect(literalCount).toBe(1);
    });

    it("should override language features with later levels", () => {
      const fundamentals = getLanguageFeatures("fundamentals", "javascript");
      const variables = getLanguageFeatures("variables", "javascript");

      // fundamentals shouldn't have this flag
      expect(fundamentals.requireVariableInstantiation).toBeUndefined();

      // variables should have it
      expect(variables.requireVariableInstantiation).toBe(true);

      // Both should maintain base restrictions
      expect(fundamentals.allowTruthiness).toBe(false);
      expect(variables.allowTruthiness).toBe(false);
    });

    it("should work for Python as well", () => {
      const features = getLanguageFeatures("variables", "python");

      // Should have nodes from both levels
      expect(features.allowedNodes).toContain("LiteralExpression");
      expect(features.allowedNodes).toContain("AssignmentStatement");
      expect(features.allowedNodes).toContain("BinaryExpression");
    });

    it("should return empty object for invalid level", () => {
      const features = getLanguageFeatures("invalid-level", "javascript");
      expect(features).toEqual({});
    });
  });
});
