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
    it("should return features for using-functions", () => {
      const flags = getFeatureFlags("using-functions", "javascript") as JavaScriptFeatureFlags;
      expect(flags).toEqual({ allowedGlobals: ["console"], oneStatementPerLine: true, enforceFormatting: true });
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
      expect(features.allowedNodes).toContain("IfStatement");

      // Should NOT have later features
      expect(features.allowedNodes).not.toContain("FunctionDeclaration");
      expect(features.allowedNodes).not.toContain("ReturnStatement");
      expect(features.allowedNodes).not.toContain("TemplateLiteralExpression");
    });

    it("should accumulate nodes up to string-manipulation", () => {
      const features = getLanguageFeatures("string-manipulation", "javascript");

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

    it("should accumulate allowedGlobals across levels", () => {
      // using-functions introduces console
      const usingFunctions = getLanguageFeatures("using-functions", "javascript");
      expect(usingFunctions.allowedGlobals).toEqual(["console"]);

      // functions-that-return-things adds Math
      const ftrThings = getLanguageFeatures("functions-that-return-things", "javascript");
      expect(ftrThings.allowedGlobals).toContain("console");
      expect(ftrThings.allowedGlobals).toContain("Math");

      // advanced-lists adds Number
      const continueBreak = getLanguageFeatures("advanced-lists", "javascript");
      expect(continueBreak.allowedGlobals).toContain("console");
      expect(continueBreak.allowedGlobals).toContain("Math");
      expect(continueBreak.allowedGlobals).toContain("Number");
    });

    it("should accumulate allowedStdlib across levels", () => {
      // methods-and-properties introduces string stdlib
      const methodsProps = getLanguageFeatures("methods-and-properties", "javascript");
      expect(methodsProps.allowedStdlib?.string?.properties).toContain("length");
      expect(methodsProps.allowedStdlib?.string?.methods).toContain("toUpperCase");
      expect(methodsProps.allowedStdlib?.array).toBeUndefined();

      // lists adds array stdlib, keeps string stdlib
      const listsLevel = getLanguageFeatures("lists", "javascript");
      expect(listsLevel.allowedStdlib?.string?.properties).toContain("length");
      expect(listsLevel.allowedStdlib?.string?.methods).toContain("toUpperCase");
      expect(listsLevel.allowedStdlib?.array?.properties).toContain("length");
      expect(listsLevel.allowedStdlib?.array?.methods).toContain("push");
    });

    it("should accumulate jikiscript allowedStdlibFunctions across levels", () => {
      // functions-that-return-things introduces random_number
      const ftrThings = getLanguageFeatures("functions-that-return-things", "jikiscript");
      expect(ftrThings.allowedStdlibFunctions).toEqual(["random_number"]);

      // string-manipulation adds concatenate, number_to_string
      const strManip = getLanguageFeatures("string-manipulation", "jikiscript");
      expect(strManip.allowedStdlibFunctions).toContain("random_number");
      expect(strManip.allowedStdlibFunctions).toContain("concatenate");
      expect(strManip.allowedStdlibFunctions).toContain("number_to_string");

      // dictionaries should have all functions from earlier levels
      const dicts = getLanguageFeatures("dictionaries", "jikiscript");
      expect(dicts.allowedStdlibFunctions).toContain("random_number");
      expect(dicts.allowedStdlibFunctions).toContain("concatenate");
      expect(dicts.allowedStdlibFunctions).toContain("number_to_string");
      expect(dicts.allowedStdlibFunctions).toContain("keys");
      expect(dicts.allowedStdlibFunctions).toContain("string_to_number");
      expect(dicts.allowedStdlibFunctions).toContain("to_upper_case");
      expect(dicts.allowedStdlibFunctions).toContain("push");
      expect(dicts.allowedStdlibFunctions).toContain("has_key");
      expect(dicts.allowedStdlibFunctions).toContain("to_lower_case");
    });

    it("should not duplicate allowedGlobals", () => {
      const everything = getLanguageFeatures("everything", "javascript");
      const consoleCount = everything.allowedGlobals?.filter((g) => g === "console").length ?? 0;
      expect(consoleCount).toBe(1);
    });
  });
});
