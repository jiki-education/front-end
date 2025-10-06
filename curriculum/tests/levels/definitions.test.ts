import { describe, it, expect } from "vitest";
import { getLevel, getLevelIds } from "../../src/levels";

describe("Level Definitions", () => {
  describe("fundamentals level", () => {
    const level = getLevel("fundamentals")!;

    it("should have appropriate metadata", () => {
      expect(level.id).toBe("fundamentals");
      expect(level.title).toBe("Programming Fundamentals");
      expect(level.description).toBeDefined();
      expect(level.description).toContain("function calls");
      expect(level.description).toContain("literal values");
    });

    it("should only allow basic JavaScript nodes", () => {
      const jsFeatures = level.languageFeatures.javascript!;
      expect(jsFeatures.allowedNodes).toBeDefined();

      // Should allow basics (using actual NodeType names from interpreters)
      expect(jsFeatures.allowedNodes).toContain("ExpressionStatement");
      expect(jsFeatures.allowedNodes).toContain("LiteralExpression");
      expect(jsFeatures.allowedNodes).toContain("IdentifierExpression");
      expect(jsFeatures.allowedNodes).toContain("MemberExpression");

      // Should NOT allow advanced features
      expect(jsFeatures.allowedNodes).not.toContain("IfStatement");
      expect(jsFeatures.allowedNodes).not.toContain("ForStatement");
      expect(jsFeatures.allowedNodes).not.toContain("VariableDeclaration");
    });

    it("should have restrictive feature flags", () => {
      const jsFlags = level.languageFeatures.javascript?.languageFeatures!;

      expect(jsFlags.allowTruthiness).toBe(false);
      expect(jsFlags.allowTypeCoercion).toBe(false);
      expect(jsFlags.enforceStrictEquality).toBe(true);
      expect(jsFlags.allowShadowing).toBe(false);
    });

    it("should have Python nodes mirroring JavaScript functionality", () => {
      expect(level.languageFeatures.python).toBeDefined();
      expect(level.languageFeatures.python?.allowedNodes).toEqual([
        "ExpressionStatement",
        "LiteralExpression",
        "IdentifierExpression"
      ]);
      expect(level.languageFeatures.python?.languageFeatures).toEqual({
        allowTruthiness: false,
        allowTypeCoercion: false
      });
    });
  });

  describe("variables level", () => {
    const level = getLevel("variables")!;

    it("should have appropriate metadata", () => {
      expect(level.id).toBe("variables");
      expect(level.title).toBe("Variables and Assignments");
      expect(level.description).toBeDefined();
      expect(level.description).toContain("declare variables");
      expect(level.description).toContain("basic operations");
    });

    it("should include all fundamentals nodes plus variable-specific ones", () => {
      const fundamentalsJS = getLevel("fundamentals")!.languageFeatures.javascript!;
      const variablesJS = level.languageFeatures.javascript!;

      // Should include everything from fundamentals
      fundamentalsJS.allowedNodes?.forEach((node) => {
        expect(variablesJS.allowedNodes).toContain(node);
      });

      // Plus new variable-related nodes (using actual NodeType names)
      expect(variablesJS.allowedNodes).toContain("VariableDeclaration");
      expect(variablesJS.allowedNodes).toContain("AssignmentExpression");
      expect(variablesJS.allowedNodes).toContain("BinaryExpression");
      expect(variablesJS.allowedNodes).toContain("UpdateExpression");
    });

    it("should enable variable-specific feature flags", () => {
      const jsFlags = level.languageFeatures.javascript?.languageFeatures!;

      expect(jsFlags.requireVariableInstantiation).toBe(true);
      expect(jsFlags.allowShadowing).toBe(false); // Still restrictive

      // Should maintain restrictions from fundamentals
      expect(jsFlags.allowTruthiness).toBe(false);
      expect(jsFlags.allowTypeCoercion).toBe(false);
    });

    it("should have Python nodes for variable operations", () => {
      expect(level.languageFeatures.python).toBeDefined();
      expect(level.languageFeatures.python?.allowedNodes).toContain("AssignmentStatement");
      expect(level.languageFeatures.python?.allowedNodes).toContain("BinaryExpression");
      expect(level.languageFeatures.python?.allowedNodes).toContain("UnaryExpression");
      expect(level.languageFeatures.python?.languageFeatures).toEqual({
        allowTruthiness: false,
        allowTypeCoercion: false
      });
    });
  });

  describe("level progression validation", () => {
    it("each level should be a superset of the previous", () => {
      const levelIds = getLevelIds();

      for (let i = 1; i < levelIds.length; i++) {
        const prevLevel = getLevel(levelIds[i - 1])!;
        const currLevel = getLevel(levelIds[i])!;

        // Check JavaScript nodes
        const prevJSNodes = prevLevel.languageFeatures.javascript?.allowedNodes || [];
        const currJSNodes = currLevel.languageFeatures.javascript?.allowedNodes || [];

        if (prevJSNodes.length > 0 && currJSNodes.length > 0) {
          prevJSNodes.forEach((node) => {
            expect(currJSNodes).toContain(node);
          });
          expect(currJSNodes.length).toBeGreaterThanOrEqual(prevJSNodes.length);
        }

        // Check Python nodes
        const prevPyNodes = prevLevel.languageFeatures.python?.allowedNodes || [];
        const currPyNodes = currLevel.languageFeatures.python?.allowedNodes || [];

        if (prevPyNodes.length > 0 && currPyNodes.length > 0) {
          prevPyNodes.forEach((node) => {
            expect(currPyNodes).toContain(node);
          });
          expect(currPyNodes.length).toBeGreaterThanOrEqual(prevPyNodes.length);
        }
      }
    });

    it("no level should enable dangerous features too early", () => {
      const levelIds = getLevelIds();

      levelIds.forEach((id) => {
        const level = getLevel(id)!;
        const jsFlags = level.languageFeatures.javascript?.languageFeatures;

        if (jsFlags) {
          // Early levels should be restrictive
          if (id === "fundamentals" || id === "variables") {
            expect(jsFlags.allowTruthiness).toBe(false);
            expect(jsFlags.allowTypeCoercion).toBe(false);
            expect(jsFlags.allowShadowing).toBe(false);
          }
        }
      });
    });

    it("all levels should have consistent structure", () => {
      const levelIds = getLevelIds();

      levelIds.forEach((id) => {
        const level = getLevel(id)!;

        // Should have at least one language
        const hasJS = level.languageFeatures.javascript !== undefined;
        const hasPython = level.languageFeatures.python !== undefined;
        expect(hasJS || hasPython).toBe(true);

        // If has JavaScript, should have both nodes and language features
        if (hasJS) {
          expect(level.languageFeatures.javascript!.allowedNodes).toBeDefined();
          expect(Array.isArray(level.languageFeatures.javascript!.allowedNodes)).toBe(true);
          expect(level.languageFeatures.javascript!.allowedNodes!.length).toBeGreaterThan(0);
          expect(level.languageFeatures.javascript!.languageFeatures).toBeDefined();
        }

        // If has Python, should have nodes
        if (hasPython) {
          expect(level.languageFeatures.python!.allowedNodes).toBeDefined();
          expect(Array.isArray(level.languageFeatures.python!.allowedNodes)).toBe(true);
          expect(level.languageFeatures.python!.allowedNodes!.length).toBeGreaterThan(0);
        }
      });
    });
  });
});
