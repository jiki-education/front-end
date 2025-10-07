import { describe, test, expect } from "vitest";
import { compile } from "@jikiscript/interpreter";

describe("JikiScript compile()", () => {
  describe("successful compilation", () => {
    test("returns success for valid code", () => {
      const result = compile("set x to 5");
      expect(result).toEqual({ success: true });
    });

    test("returns success for multiple statements", () => {
      const result = compile(`set x to 5
set y to 10
set z to x + y`);
      expect(result).toEqual({ success: true });
    });

    test("returns success for if statement", () => {
      const result = compile(`set x to 5
if x > 0 do
  set y to 10
end`);
      expect(result).toEqual({ success: true });
    });

    test("returns success for repeat statement", () => {
      const result = compile(`repeat 5 times do
  set x to 10
end`);
      expect(result).toEqual({ success: true });
    });

    test("returns success for dictionary", () => {
      const result = compile('set person to {"name": "Alice", "age": 30}');
      expect(result).toEqual({ success: true });
    });

    test("returns success for list", () => {
      const result = compile("set numbers to [1, 2, 3, 4, 5]");
      expect(result).toEqual({ success: true });
    });

    test("returns success for arithmetic", () => {
      const result = compile("set result to (5 + 3) * 2");
      expect(result).toEqual({ success: true });
    });
  });

  describe("compilation errors", () => {
    test("returns failure for syntax error", () => {
      const result = compile("set x");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    test("returns failure for missing end keyword", () => {
      const result = compile(`if x > 0 do
  set y to 10`);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    test("returns failure for invalid expression", () => {
      const result = compile("set x to +");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    test("returns failure for malformed function", () => {
      const result = compile(`function add
  return 5
end`);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });
  });

  describe("with language features", () => {
    test("compiles successfully with custom language features", () => {
      const result = compile("set x to 5", {
        languageFeatures: {
          timePerFrame: 2,
        },
      });
      expect(result).toEqual({ success: true });
    });

    test("returns failure for disabled feature", () => {
      const result = compile("repeat 5 times do\n  set x to 10\nend", {
        languageFeatures: {
          excludeList: ["REPEAT"],
        },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
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

    test("handles multiple comments", () => {
      const result = compile(`// comment 1
// comment 2
// comment 3`);
      expect(result).toEqual({ success: true });
    });
  });
});
