import { describe, test, expect } from "vitest";
import { interpret } from "@javascript/interpreter";

describe("JavaScript assertors", () => {
  describe("countLinesOfCode", () => {
    test("counts non-empty, non-comment lines", () => {
      const result = interpret("let x = 5;\nlet y = 10;");
      expect(result.assertors.countLinesOfCode()).toBe(2);
    });

    test("skips empty lines", () => {
      const result = interpret("let x = 5;\n\nlet y = 10;");
      expect(result.assertors.countLinesOfCode()).toBe(2);
    });

    test("skips single-line comments", () => {
      const result = interpret("// comment\nlet x = 5;");
      expect(result.assertors.countLinesOfCode()).toBe(1);
    });

    test("skips multi-line comments", () => {
      const result = interpret("/* comment\n   still comment */\nlet x = 5;");
      expect(result.assertors.countLinesOfCode()).toBe(1);
    });

    test("skips whitespace-only lines", () => {
      const result = interpret("let x = 5;\n   \nlet y = 10;");
      expect(result.assertors.countLinesOfCode()).toBe(2);
    });

    test("returns 0 on parse error", () => {
      const result = interpret("let let let");
      expect(result.assertors.countLinesOfCode()).toBe(0);
    });
  });

  describe("assertMaxLinesOfCode", () => {
    test("returns true when under limit", () => {
      const result = interpret("let x = 5;");
      expect(result.assertors.assertMaxLinesOfCode(3)).toBe(true);
    });

    test("returns true when at limit", () => {
      const result = interpret("let x = 5;\nlet y = 10;");
      expect(result.assertors.assertMaxLinesOfCode(2)).toBe(true);
    });

    test("returns false when over limit", () => {
      const result = interpret("let x = 5;\nlet y = 10;\nlet z = 15;");
      expect(result.assertors.assertMaxLinesOfCode(2)).toBe(false);
    });

    test("returns true on parse error", () => {
      const result = interpret("let let let");
      expect(result.assertors.assertMaxLinesOfCode(1)).toBe(true);
    });
  });

  describe("assertFunctionDefined", () => {
    test("returns true when function exists (snake_case input)", () => {
      const result = interpret("function turnAround() {}");
      expect(result.assertors.assertFunctionDefined("turn_around")).toBe(true);
    });

    test("returns false when function does not exist", () => {
      const result = interpret("let x = 5;");
      expect(result.assertors.assertFunctionDefined("turn_around")).toBe(false);
    });

    test("returns true on parse error", () => {
      const result = interpret("let let let");
      expect(result.assertors.assertFunctionDefined("turn_around")).toBe(true);
    });
  });

  describe("assertMethodCalled", () => {
    test("returns true when method is called", () => {
      const result = interpret("let arr = [];\narr.push(1);");
      expect(result.assertors.assertMethodCalled("push")).toBe(true);
    });

    test("returns false when method is not called", () => {
      const result = interpret("let x = 5;");
      expect(result.assertors.assertMethodCalled("push")).toBe(false);
    });

    test("returns true on parse error", () => {
      const result = interpret("let let let");
      expect(result.assertors.assertMethodCalled("push")).toBe(true);
    });
  });

  describe("countArrayLiterals", () => {
    test("counts zero array literals", () => {
      const result = interpret("let x = 5;");
      expect(result.assertors.countArrayLiterals()).toBe(0);
    });

    test("counts one array literal", () => {
      const result = interpret("let arr = [];");
      expect(result.assertors.countArrayLiterals()).toBe(1);
    });

    test("counts multiple array literals", () => {
      const result = interpret("let a = [];\nlet b = [1, 2];");
      expect(result.assertors.countArrayLiterals()).toBe(2);
    });

    test("returns 0 on parse error", () => {
      const result = interpret("let let let");
      expect(result.assertors.countArrayLiterals()).toBe(0);
    });
  });

  describe("assertFunctionCalledOutsideOwnDefinition", () => {
    test("returns true when function is called from another function", () => {
      const code = `function includes(str, char) {
  return str.indexOf(char) >= 0;
}
function isPangram(str) {
  return includes(str, "a");
}`;
      const result = interpret(code);
      expect(result.assertors.assertFunctionCalledOutsideOwnDefinition("includes")).toBe(true);
    });

    test("returns false when function is only called inside itself", () => {
      const code = `function includes(str, char) {
  if (str.length === 0) { return false; }
  return includes(str, char);
}`;
      const result = interpret(code);
      expect(result.assertors.assertFunctionCalledOutsideOwnDefinition("includes")).toBe(false);
    });

    test("returns false when function is not called at all", () => {
      const code = `function includes(str, char) {
  return true;
}
let x = 5;`;
      const result = interpret(code);
      expect(result.assertors.assertFunctionCalledOutsideOwnDefinition("includes")).toBe(false);
    });

    test("handles snake_case to camelCase conversion", () => {
      const code = `function isPangram(str) {
  return true;
}
isPangram("hello");`;
      const result = interpret(code);
      expect(result.assertors.assertFunctionCalledOutsideOwnDefinition("is_pangram")).toBe(true);
    });

    test("returns true on parse error", () => {
      const result = interpret("let let let");
      expect(result.assertors.assertFunctionCalledOutsideOwnDefinition("includes")).toBe(true);
    });
  });
});
