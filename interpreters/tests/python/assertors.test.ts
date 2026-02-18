import { describe, test, expect } from "vitest";
import { interpret } from "@python/interpreter";

describe("Python assertors", () => {
  describe("countLinesOfCode", () => {
    test("counts non-empty, non-comment lines", () => {
      const result = interpret("x = 5\ny = 10");
      expect(result.assertors.countLinesOfCode()).toBe(2);
    });

    test("skips empty lines", () => {
      const result = interpret("x = 5\n\ny = 10");
      expect(result.assertors.countLinesOfCode()).toBe(2);
    });

    test("skips comment lines", () => {
      const result = interpret("# comment\nx = 5");
      expect(result.assertors.countLinesOfCode()).toBe(1);
    });

    test("returns 0 on parse error", () => {
      const result = interpret("def def def");
      expect(result.assertors.countLinesOfCode()).toBe(0);
    });
  });

  describe("assertMaxLinesOfCode", () => {
    test("returns true when under limit", () => {
      const result = interpret("x = 5");
      expect(result.assertors.assertMaxLinesOfCode(3)).toBe(true);
    });

    test("returns true when at limit", () => {
      const result = interpret("x = 5\ny = 10");
      expect(result.assertors.assertMaxLinesOfCode(2)).toBe(true);
    });

    test("returns false when over limit", () => {
      const result = interpret("x = 5\ny = 10\nz = 15");
      expect(result.assertors.assertMaxLinesOfCode(2)).toBe(false);
    });

    test("returns true on parse error", () => {
      const result = interpret("def def def");
      expect(result.assertors.assertMaxLinesOfCode(1)).toBe(true);
    });
  });

  describe("assertFunctionDefined", () => {
    test("returns true when function exists", () => {
      const code = `def turn_around():
    x = 1`;
      const result = interpret(code);
      expect(result.assertors.assertFunctionDefined("turn_around")).toBe(true);
    });

    test("returns false when function does not exist", () => {
      const result = interpret("x = 5");
      expect(result.assertors.assertFunctionDefined("turn_around")).toBe(false);
    });

    test("returns true on parse error", () => {
      const result = interpret("def def def");
      expect(result.assertors.assertFunctionDefined("turn_around")).toBe(true);
    });
  });

  describe("assertMethodCalled", () => {
    test("returns true when method is called", () => {
      const result = interpret("arr = []\narr.append(1)");
      expect(result.assertors.assertMethodCalled("append")).toBe(true);
    });

    test("returns false when method is not called", () => {
      const result = interpret("x = 5");
      expect(result.assertors.assertMethodCalled("append")).toBe(false);
    });

    test("finds method calls inside function bodies", () => {
      const code = `def foo():
    arr = []
    arr.append(1)`;
      const result = interpret(code);
      expect(result.assertors.assertMethodCalled("append")).toBe(true);
    });

    test("returns true on parse error", () => {
      const result = interpret("def def def");
      expect(result.assertors.assertMethodCalled("append")).toBe(true);
    });
  });

  describe("countArrayLiterals", () => {
    test("counts zero list literals", () => {
      const result = interpret("x = 5");
      expect(result.assertors.countArrayLiterals()).toBe(0);
    });

    test("counts one list literal", () => {
      const result = interpret("arr = []");
      expect(result.assertors.countArrayLiterals()).toBe(1);
    });

    test("counts multiple list literals", () => {
      const result = interpret("a = []\nb = [1, 2]");
      expect(result.assertors.countArrayLiterals()).toBe(2);
    });

    test("counts list literals inside function bodies", () => {
      const code = `def foo():
    arr = []`;
      const result = interpret(code);
      expect(result.assertors.countArrayLiterals()).toBe(1);
    });

    test("returns 0 on parse error", () => {
      const result = interpret("def def def");
      expect(result.assertors.countArrayLiterals()).toBe(0);
    });
  });

  describe("assertFunctionCalledOutsideOwnDefinition", () => {
    test("returns true when function is called from another function", () => {
      const code = `def includes(s, c):
    return True
def is_pangram(s):
    return includes(s, "a")`;
      const result = interpret(code);
      expect(result.assertors.assertFunctionCalledOutsideOwnDefinition("includes")).toBe(true);
    });

    test("returns false when function is only called inside itself", () => {
      const code = `def includes(s, c):
    return includes(s, c)`;
      const result = interpret(code);
      expect(result.assertors.assertFunctionCalledOutsideOwnDefinition("includes")).toBe(false);
    });

    test("returns false when function is not called at all", () => {
      const code = `def includes(s, c):
    return True
x = 5`;
      const result = interpret(code);
      expect(result.assertors.assertFunctionCalledOutsideOwnDefinition("includes")).toBe(false);
    });

    test("returns true on parse error", () => {
      const result = interpret("def def def");
      expect(result.assertors.assertFunctionCalledOutsideOwnDefinition("includes")).toBe(true);
    });
  });
});
