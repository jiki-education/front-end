import { describe, it, expect } from "vitest";
import { getAllowedNodes, getFeatureFlags, getLanguageFeatures, type JavaScriptFeatureFlags } from "../../src/levels";

describe("Language Features", () => {
  describe("getAllowedNodes", () => {
    it("should return allowed nodes for using-functions", () => {
      const nodes = getAllowedNodes("using-functions", "javascript");
      expect(nodes).toBeDefined();
      expect(nodes).toContain("ExpressionStatement");
      expect(nodes).toContain("CallExpression");
      expect(nodes).toContain("LiteralExpression");
      expect(nodes).not.toContain("IfStatement");
    });

    it("should return allowed nodes for variables", () => {
      const nodes = getAllowedNodes("variables", "javascript");
      expect(nodes).toBeDefined();
      expect(nodes).toContain("VariableDeclaration");
      expect(nodes).toContain("BinaryExpression");
    });

    it("should return undefined for unconfigured language", () => {
      // @ts-expect-error Testing invalid language
      const nodes = getAllowedNodes("using-functions", "ruby");
      expect(nodes).toBeUndefined();
    });
  });

  describe("getFeatureFlags", () => {
    it("should return empty features for using-functions", () => {
      const flags = getFeatureFlags("using-functions", "javascript") as JavaScriptFeatureFlags;
      expect(flags).toEqual({});
    });

    it("should return restrictive features for variables", () => {
      const flags = getFeatureFlags("variables", "javascript") as JavaScriptFeatureFlags;
      expect(flags.requireVariableInstantiation).toBe(true);
      expect(flags.allowShadowing).toBe(false);
      expect(flags.allowTruthiness).toBe(false);
    });

    it("should return empty object for unconfigured language", () => {
      // @ts-expect-error Testing invalid language
      const flags = getFeatureFlags("using-functions", "ruby");
      expect(flags).toEqual({});
    });
  });

  describe("getLanguageFeatures - accumulation", () => {
    it("should accumulate nodes from all previous levels up to variables", () => {
      const features = getLanguageFeatures("variables", "javascript");

      // From using-functions
      expect(features.allowedNodes).toContain("ExpressionStatement");
      expect(features.allowedNodes).toContain("CallExpression");
      expect(features.allowedNodes).toContain("LiteralExpression");
      // From repeat-loop
      expect(features.allowedNodes).toContain("RepeatStatement");
      expect(features.allowedNodes).toContain("BlockStatement");
      // From variables itself
      expect(features.allowedNodes).toContain("VariableDeclaration");
      expect(features.allowedNodes).toContain("BinaryExpression");
      expect(features.allowedNodes).toContain("GroupingExpression");
    });

    it("should accumulate nodes up to conditionals", () => {
      const features = getLanguageFeatures("conditionals", "javascript");

      // Should have everything up to and including conditionals
      expect(features.allowedNodes).toContain("ExpressionStatement");
      expect(features.allowedNodes).toContain("RepeatStatement");
      expect(features.allowedNodes).toContain("VariableDeclaration");
      expect(features.allowedNodes).toContain("AssignmentExpression");
      expect(features.allowedNodes).toContain("MemberExpression");
      expect(features.allowedNodes).toContain("IfStatement");

      // Should NOT have later features
      expect(features.allowedNodes).not.toContain("FunctionDeclaration");
      expect(features.allowedNodes).not.toContain("ReturnStatement");
      expect(features.allowedNodes).not.toContain("TemplateLiteralExpression");
    });

    it("should accumulate nodes up to string-concatenation-and-templates", () => {
      const features = getLanguageFeatures("string-concatenation-and-templates", "javascript");

      expect(features.allowedNodes).toContain("FunctionDeclaration");
      expect(features.allowedNodes).toContain("ReturnStatement");
      expect(features.allowedNodes).toContain("TemplateLiteralExpression");
    });

    it("should not duplicate nodes", () => {
      const features = getLanguageFeatures("everything", "javascript");
      const identifierCount = features.allowedNodes?.filter((n) => n === "IdentifierExpression").length ?? 0;
      expect(identifierCount).toBe(1);
    });

    it("should override language features with later levels", () => {
      const usingFunctions = getLanguageFeatures("using-functions", "javascript");
      const variables = getLanguageFeatures("variables", "javascript");

      // using-functions shouldn't have this flag
      expect(usingFunctions.requireVariableInstantiation).toBeUndefined();

      // variables should have it (set by strings-and-colors or variables level)
      expect(variables.requireVariableInstantiation).toBe(true);
    });

    it("should return empty object for invalid level", () => {
      const features = getLanguageFeatures("invalid-level", "javascript");
      expect(features).toEqual({});
    });

    it("should return proper shape for interpreter consumption", () => {
      const features = getLanguageFeatures("variables", "javascript");
      expect(features).toHaveProperty("allowedNodes");
      expect(Array.isArray(features.allowedNodes)).toBe(true);
      expect(typeof features.allowShadowing).toBe("boolean");
      expect(typeof features.requireVariableInstantiation).toBe("boolean");
    });
  });
});
