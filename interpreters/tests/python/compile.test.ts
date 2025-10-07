import { describe, test, expect } from "vitest";
import { compile } from "@python/interpreter";

describe("Python compile()", () => {
  describe("successful compilation", () => {
    test("returns success for valid code", () => {
      const result = compile("x = 5");
      expect(result).toEqual({ success: true });
    });

    test("returns success for multiple statements", () => {
      const result = compile(`x = 5
y = 10
z = x + y`);
      expect(result).toEqual({ success: true });
    });

    test("returns success for if statement", () => {
      const result = compile(`x = 5
if x > 0:
    y = 10`);
      expect(result).toEqual({ success: true });
    });

    test("returns success for nested if statements", () => {
      const result = compile(`x = 5
if x > 0:
    y = 10
    if y > 5:
        z = 15`);
      expect(result).toEqual({ success: true });
    });

    test("returns success for arithmetic expressions", () => {
      const result = compile(`result = (5 + 3) * 2 - 4 / 2`);
      expect(result).toEqual({ success: true });
    });

    test("returns success for boolean operations", () => {
      const result = compile(`result = True and False or not True`);
      expect(result).toEqual({ success: true });
    });

    test("returns success for string operations", () => {
      const result = compile(`message = "hello" + " " + "world"`);
      expect(result).toEqual({ success: true });
    });

    test("returns success for lists", () => {
      const result = compile(`numbers = [1, 2, 3, 4, 5]
first = numbers[0]`);
      expect(result).toEqual({ success: true });
    });

    test("returns success for for loops", () => {
      const result = compile(`for i in range(5):
    x = i * 2`);
      expect(result).toEqual({ success: true });
    });
  });

  describe("compilation errors", () => {
    test("returns failure for syntax error", () => {
      const result = compile("x = ");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    test("returns failure for invalid indentation", () => {
      const result = compile(`if True:
  x = 5`);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    test("returns failure for missing colon", () => {
      const result = compile(`if True
    x = 5`);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    test("returns failure for unclosed bracket", () => {
      const result = compile("arr = [1, 2, 3");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    test("returns failure for unclosed parenthesis", () => {
      const result = compile("result = (5 + 3");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    test("returns failure for invalid expression", () => {
      const result = compile("x = 5 + + ");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    test("returns failure for unexpected dedent", () => {
      const result = compile(`if True:
    x = 5
  y = 10`);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });
  });

  describe("with language features", () => {
    test("compiles successfully with custom language features", () => {
      const result = compile("x = 5", {
        languageFeatures: {
          allowTypeCoercion: true,
        },
      });
      expect(result).toEqual({ success: true });
    });
  });

  describe("edge cases", () => {
    test("handles empty string", () => {
      const result = compile("");
      expect(result).toEqual({ success: true });
    });

    test("handles newlines only", () => {
      const result = compile("\n\n\n");
      expect(result).toEqual({ success: true });
    });

    test("handles comments only", () => {
      const result = compile("# just a comment");
      expect(result).toEqual({ success: true });
    });

    test("handles multiple comments", () => {
      const result = compile(`# comment 1
# comment 2
# comment 3`);
      expect(result).toEqual({ success: true });
    });

    test("handles inline comments", () => {
      const result = compile("x = 5  # assign 5 to x");
      expect(result).toEqual({ success: true });
    });
  });
});
