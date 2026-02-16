import { describe, it, expect } from "vitest";
import { getLevel } from "../../src/levels";

describe("Level Definitions", () => {
  describe("using-functions level", () => {
    const level = getLevel("using-functions")!;

    it("should allow basic function call nodes", () => {
      const jsFeatures = level.languageFeatures.javascript!;
      expect(jsFeatures.allowedNodes).toContain("ExpressionStatement");
      expect(jsFeatures.allowedNodes).toContain("CallExpression");
      expect(jsFeatures.allowedNodes).toContain("IdentifierExpression");
      expect(jsFeatures.allowedNodes).toContain("LiteralExpression");
    });

    it("should not allow advanced features", () => {
      const jsFeatures = level.languageFeatures.javascript!;
      expect(jsFeatures.allowedNodes).not.toContain("IfStatement");
      expect(jsFeatures.allowedNodes).not.toContain("ForStatement");
      expect(jsFeatures.allowedNodes).not.toContain("VariableDeclaration");
    });
  });

  describe("variables level", () => {
    const level = getLevel("variables")!;

    it("should introduce variable-related nodes", () => {
      const jsFeatures = level.languageFeatures.javascript!;
      expect(jsFeatures.allowedNodes).toContain("VariableDeclaration");
      expect(jsFeatures.allowedNodes).toContain("IdentifierExpression");
      expect(jsFeatures.allowedNodes).toContain("BinaryExpression");
      expect(jsFeatures.allowedNodes).toContain("GroupingExpression");
    });

    it("should have restrictive feature flags", () => {
      const jsFlags = level.languageFeatures.javascript?.languageFeatures!;
      expect(jsFlags.requireVariableInstantiation).toBe(true);
      expect(jsFlags.allowShadowing).toBe(false);
      expect(jsFlags.allowTruthiness).toBe(false);
      expect(jsFlags.allowTypeCoercion).toBe(false);
      expect(jsFlags.enforceStrictEquality).toBe(true);
    });
  });

  describe("repeat-loop level", () => {
    const level = getLevel("repeat-loop")!;

    it("should introduce RepeatStatement and BlockStatement", () => {
      const jsFeatures = level.languageFeatures.javascript!;
      expect(jsFeatures.allowedNodes).toContain("RepeatStatement");
      expect(jsFeatures.allowedNodes).toContain("BlockStatement");
    });
  });

  describe("basic-state level", () => {
    const level = getLevel("basic-state")!;

    it("should introduce AssignmentExpression and UnaryExpression", () => {
      const jsFeatures = level.languageFeatures.javascript!;
      expect(jsFeatures.allowedNodes).toContain("AssignmentExpression");
      expect(jsFeatures.allowedNodes).toContain("UnaryExpression");
    });
  });

  describe("conditionals level", () => {
    const level = getLevel("conditionals")!;

    it("should introduce IfStatement", () => {
      const jsFeatures = level.languageFeatures.javascript!;
      expect(jsFeatures.allowedNodes).toContain("IfStatement");
    });
  });

  describe("make-your-own-functions level", () => {
    const level = getLevel("make-your-own-functions")!;

    it("should introduce FunctionDeclaration", () => {
      const jsFeatures = level.languageFeatures.javascript!;
      expect(jsFeatures.allowedNodes).toContain("FunctionDeclaration");
    });
  });

  describe("adding-returns-to-your-functions level", () => {
    const level = getLevel("adding-returns-to-your-functions")!;

    it("should introduce ReturnStatement", () => {
      const jsFeatures = level.languageFeatures.javascript!;
      expect(jsFeatures.allowedNodes).toContain("ReturnStatement");
    });
  });

  describe("string-concatenation-and-templates level", () => {
    const level = getLevel("string-concatenation-and-templates")!;

    it("should introduce TemplateLiteralExpression", () => {
      const jsFeatures = level.languageFeatures.javascript!;
      expect(jsFeatures.allowedNodes).toContain("TemplateLiteralExpression");
    });
  });

  describe("everything level", () => {
    const level = getLevel("everything")!;

    it("should include all node types", () => {
      const jsFeatures = level.languageFeatures.javascript!;
      expect(jsFeatures.allowedNodes).toContain("RepeatStatement");
      expect(jsFeatures.allowedNodes).toContain("FunctionDeclaration");
      expect(jsFeatures.allowedNodes).toContain("ReturnStatement");
      expect(jsFeatures.allowedNodes).toContain("TemplateLiteralExpression");
      expect(jsFeatures.allowedNodes).toContain("IfStatement");
      expect(jsFeatures.allowedNodes).toContain("ForStatement");
    });

    it("should have permissive feature flags", () => {
      const jsFlags = level.languageFeatures.javascript?.languageFeatures!;
      expect(jsFlags.allowTruthiness).toBe(true);
      expect(jsFlags.allowTypeCoercion).toBe(true);
      expect(jsFlags.allowShadowing).toBe(true);
    });
  });
});
