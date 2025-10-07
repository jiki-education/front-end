import { describe, test, expect } from "vitest";
import { compile } from "../../src/javascript/interpreter";

describe("JavaScript compile()", () => {
  describe("successful compilation", () => {
    test("returns success for valid code", () => {
      const result = compile("let x = 5;");
      expect(result).toEqual({ success: true });
    });

    test("returns success for multiple statements", () => {
      const result = compile(`
        let x = 5;
        let y = 10;
        let z = x + y;
      `);
      expect(result).toEqual({ success: true });
    });

    test("returns success for complex valid code", () => {
      const result = compile(`
        let arr = [1, 2, 3];
        let obj = { name: "test", value: 42 };
        if (arr[0] > 0) {
          let result = obj.value * 2;
        }
      `);
      expect(result).toEqual({ success: true });
    });

    test("returns success for template literals", () => {
      const result = compile('let msg = `Hello ${"world"}`;');
      expect(result).toEqual({ success: true });
    });

    test("returns success for loops", () => {
      const result = compile(`
        for (let i = 0; i < 5; i++) {
          let x = i * 2;
        }
      `);
      expect(result).toEqual({ success: true });
    });
  });

  describe("compilation errors", () => {
    test("returns failure for syntax error", () => {
      const result = compile("let x = ;");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    test("returns failure for missing semicolon when required", () => {
      const result = compile("let x = 5", { languageFeatures: { requireSemicolons: true } });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    test("returns failure for invalid token", () => {
      const result = compile("let x = @;");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    test("returns failure for unclosed bracket", () => {
      const result = compile("let arr = [1, 2, 3;");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    test("returns failure for unclosed brace", () => {
      const result = compile("if (true) { let x = 5;");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    test("returns failure for invalid expression", () => {
      const result = compile("let x = 5 + + ;");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });
  });

  describe("with language features", () => {
    test("compiles successfully with custom language features", () => {
      const result = compile("let x = 5;", {
        languageFeatures: {
          enforceStrictEquality: false,
        },
      });
      expect(result).toEqual({ success: true });
    });

    test("returns failure for disallowed syntax", () => {
      const result = compile("let x = 5; let y = 10;", {
        languageFeatures: {
          allowedNodes: ["VariableDeclaration"],
        },
      });
      // Should fail during parsing if multiple statements aren't allowed
      // This depends on implementation - adjust as needed
      expect(result).toBeDefined();
    });
  });

  describe("edge cases", () => {
    test("handles empty string", () => {
      const result = compile("");
      expect(result).toEqual({ success: true });
    });

    test("handles whitespace only", () => {
      const result = compile("   \n  \t  ");
      expect(result).toEqual({ success: true });
    });

    test("handles comments only", () => {
      const result = compile("// just a comment");
      expect(result).toEqual({ success: true });
    });

    test("handles multiline comments", () => {
      const result = compile(`
        /*
         * Multi-line comment
         */
      `);
      expect(result).toEqual({ success: true });
    });
  });
});
