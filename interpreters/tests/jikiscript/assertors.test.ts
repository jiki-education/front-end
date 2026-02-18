import { describe, test, expect } from "vitest";
import { interpret } from "@jikiscript/interpreter";
import type { ExternalFunction } from "@shared/interfaces";

const pushFunction: ExternalFunction = {
  name: "push",
  func: () => {},
  description: "Push an element",
  arity: 2,
};

describe("JikiScript assertors", () => {
  describe("countLinesOfCode", () => {
    test("counts non-empty, non-comment lines", () => {
      const result = interpret("set x to 5\nset y to 10");
      expect(result.assertors.countLinesOfCode()).toBe(2);
    });

    test("skips empty lines", () => {
      const result = interpret("set x to 5\n\nset y to 10");
      expect(result.assertors.countLinesOfCode()).toBe(2);
    });

    test("skips comment lines", () => {
      const result = interpret("// comment\nset x to 5");
      expect(result.assertors.countLinesOfCode()).toBe(1);
    });

    test("skips whitespace-only lines", () => {
      const result = interpret("set x to 5\n   \nset y to 10");
      expect(result.assertors.countLinesOfCode()).toBe(2);
    });

    test("returns 0 on parse error", () => {
      const result = interpret("set set set");
      expect(result.assertors.countLinesOfCode()).toBe(0);
    });
  });

  describe("assertMaxLinesOfCode", () => {
    test("returns true when under limit", () => {
      const result = interpret("set x to 5");
      expect(result.assertors.assertMaxLinesOfCode(3)).toBe(true);
    });

    test("returns true when at limit", () => {
      const result = interpret("set x to 5\nset y to 10");
      expect(result.assertors.assertMaxLinesOfCode(2)).toBe(true);
    });

    test("returns false when over limit", () => {
      const result = interpret("set x to 5\nset y to 10\nset z to 15");
      expect(result.assertors.assertMaxLinesOfCode(2)).toBe(false);
    });

    test("returns true on parse error", () => {
      const result = interpret("set set set");
      expect(result.assertors.assertMaxLinesOfCode(1)).toBe(true);
    });
  });

  describe("assertFunctionDefined", () => {
    test("returns true when function exists", () => {
      const result = interpret('function turn_around do\n  return "done"\nend');
      expect(result.assertors.assertFunctionDefined("turn_around")).toBe(true);
    });

    test("returns false when function does not exist", () => {
      const result = interpret("set x to 5");
      expect(result.assertors.assertFunctionDefined("turn_around")).toBe(false);
    });

    test("returns true on parse error", () => {
      const result = interpret("set set set");
      expect(result.assertors.assertFunctionDefined("turn_around")).toBe(true);
    });
  });

  describe("assertMethodCalled", () => {
    test("returns true when method is called", () => {
      const result = interpret("set arr to []\narr.add(1)");
      expect(result.assertors.assertMethodCalled("add")).toBe(true);
    });

    test("returns false when method is not called", () => {
      const result = interpret("set x to 5");
      expect(result.assertors.assertMethodCalled("add")).toBe(false);
    });

    test("returns true on parse error", () => {
      const result = interpret("set set set");
      expect(result.assertors.assertMethodCalled("add")).toBe(true);
    });
  });

  describe("countArrayLiterals", () => {
    test("counts zero list literals", () => {
      const result = interpret("set x to 5");
      expect(result.assertors.countArrayLiterals()).toBe(0);
    });

    test("counts one list literal", () => {
      const result = interpret("set arr to []");
      expect(result.assertors.countArrayLiterals()).toBe(1);
    });

    test("counts multiple list literals", () => {
      const result = interpret("set a to []\nset b to [1, 2]");
      expect(result.assertors.countArrayLiterals()).toBe(2);
    });

    test("returns 0 on parse error", () => {
      const result = interpret("set set set");
      expect(result.assertors.countArrayLiterals()).toBe(0);
    });
  });

  describe("assertFunctionCalledOutsideOwnDefinition", () => {
    test("returns true when function is called from another function", () => {
      const code = `function includes with s, c do
  return true
end
function is_pangram with s do
  return includes(s, "a")
end`;
      const result = interpret(code);
      expect(result.assertors.assertFunctionCalledOutsideOwnDefinition("includes")).toBe(true);
    });

    test("returns false when function is only called inside itself", () => {
      const code = `function includes with s, c do
  return includes(s, c)
end`;
      const result = interpret(code);
      expect(result.assertors.assertFunctionCalledOutsideOwnDefinition("includes")).toBe(false);
    });

    test("returns false when function is not called at all", () => {
      const code = `function includes with s, c do
  return true
end
set x to 5`;
      const result = interpret(code);
      expect(result.assertors.assertFunctionCalledOutsideOwnDefinition("includes")).toBe(false);
    });

    test("returns true on parse error", () => {
      const result = interpret("set set set");
      expect(result.assertors.assertFunctionCalledOutsideOwnDefinition("includes")).toBe(true);
    });
  });
});
