import { describe, test, expect } from "vitest";
import { interpret } from "@jikiscript/interpreter";
import type { ExternalFunction } from "@shared/interfaces";

const pushFunction: ExternalFunction = {
  name: "push",
  func: () => {},
  description: "Push an element",
  arity: 2,
};

const drawCircleFunction: ExternalFunction = {
  name: "draw_circle",
  func: () => {},
  description: "Draw a circle",
  arity: 3,
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

  describe("assertSomeArgumentsAreVariablesForFunction", () => {
    const ctx = { externalFunctions: [drawCircleFunction] };

    test("returns true when flagged args are variables", () => {
      const result = interpret("set x to 1\nset y to 2\ndraw_circle(x, y, 10)", ctx);
      expect(result.assertors.assertSomeArgumentsAreVariablesForFunction("draw_circle", [true, true, false])).toBe(
        true
      );
    });

    test("returns false when a flagged arg is a literal", () => {
      const result = interpret("draw_circle(100, 200, 10)", ctx);
      expect(result.assertors.assertSomeArgumentsAreVariablesForFunction("draw_circle", [true, true, false])).toBe(
        false
      );
    });

    test("returns false when a flagged arg is a negative literal", () => {
      const result = interpret("draw_circle(-100, 200, 10)", ctx);
      expect(result.assertors.assertSomeArgumentsAreVariablesForFunction("draw_circle", [true, false, false])).toBe(
        false
      );
    });

    test("ignores unflagged literal args", () => {
      const result = interpret("set x to 1\ndraw_circle(x, 200, 10)", ctx);
      expect(result.assertors.assertSomeArgumentsAreVariablesForFunction("draw_circle", [true, false, false])).toBe(
        true
      );
    });

    test("checks all calls to the same function", () => {
      const result = interpret("set x to 1\ndraw_circle(x, 1, 1)\ndraw_circle(5, 1, 1)", ctx);
      expect(result.assertors.assertSomeArgumentsAreVariablesForFunction("draw_circle", [true, false, false])).toBe(
        false
      );
    });

    test("returns true when function is not called at all", () => {
      const result = interpret("set x to 5");
      expect(result.assertors.assertSomeArgumentsAreVariablesForFunction("draw_circle", [true])).toBe(true);
    });

    test("returns true on parse error", () => {
      const result = interpret("set set set");
      expect(result.assertors.assertSomeArgumentsAreVariablesForFunction("draw_circle", [true])).toBe(true);
    });
  });

  describe("assertNoLiteralNumberAssignments", () => {
    test("returns true when no assignments have number literals", () => {
      const result = interpret("set x to 5\nset y to x + x");
      expect(result.assertors.assertNoLiteralNumberAssignments({ include: ["y"] })).toBe(true);
    });

    test("returns false when included variable is assigned a number literal", () => {
      const result = interpret("set x to 5\nset y to 10");
      expect(result.assertors.assertNoLiteralNumberAssignments({ include: ["x", "y"] })).toBe(false);
    });

    test("returns false when included variable is assigned a negative number literal", () => {
      const result = interpret("set x to -5");
      expect(result.assertors.assertNoLiteralNumberAssignments({ include: ["x"] })).toBe(false);
    });

    test("skips variables not in include list", () => {
      const result = interpret("set x to 5\nset y to 10");
      expect(result.assertors.assertNoLiteralNumberAssignments({ include: ["y"] })).toBe(false);
      expect(result.assertors.assertNoLiteralNumberAssignments({ include: ["z"] })).toBe(true);
    });

    test("skips excluded variables", () => {
      const result = interpret("set x to 5\nset y to 10");
      expect(result.assertors.assertNoLiteralNumberAssignments({ exclude: ["x", "y"] })).toBe(true);
    });

    test("only checks top-level value", () => {
      const result = interpret("set x to 5\nset y to x + 3");
      expect(result.assertors.assertNoLiteralNumberAssignments({ include: ["y"] })).toBe(true);
    });

    test("returns true on parse error", () => {
      const result = interpret("set set set");
      expect(result.assertors.assertNoLiteralNumberAssignments({ include: ["x"] })).toBe(true);
    });
  });

  describe("assertNoLiteralNumbersInAssignments", () => {
    test("returns true when assignment uses only variables", () => {
      const result = interpret("set x to 5\nset y to x + x");
      expect(result.assertors.assertNoLiteralNumbersInAssignments({ include: ["y"] })).toBe(true);
    });

    test("returns false when expression contains a number literal", () => {
      const result = interpret("set x to 5\nset y to x + 3");
      expect(result.assertors.assertNoLiteralNumbersInAssignments({ include: ["y"] })).toBe(false);
    });

    test("returns false for direct number literal assignment", () => {
      const result = interpret("set x to 10");
      expect(result.assertors.assertNoLiteralNumbersInAssignments({ include: ["x"] })).toBe(false);
    });

    test("skips variables not in include list", () => {
      const result = interpret("set x to 5\nset y to x + 3");
      expect(result.assertors.assertNoLiteralNumbersInAssignments({ include: ["x"] })).toBe(false);
      expect(result.assertors.assertNoLiteralNumbersInAssignments({ include: ["z"] })).toBe(true);
    });

    test("skips excluded variables", () => {
      const result = interpret("set x to 5\nset y to x + 3");
      expect(result.assertors.assertNoLiteralNumbersInAssignments({ exclude: ["x", "y"] })).toBe(true);
    });

    test("allows string literals in expression", () => {
      const result = interpret('set x to "hello"');
      expect(result.assertors.assertNoLiteralNumbersInAssignments({ include: ["x"] })).toBe(true);
    });

    test("checks all assignments when no include or exclude", () => {
      const result = interpret("set x to 5\nset y to x + 3");
      expect(result.assertors.assertNoLiteralNumbersInAssignments({})).toBe(false);
    });

    test("returns true on parse error", () => {
      const result = interpret("set set set");
      expect(result.assertors.assertNoLiteralNumbersInAssignments({ include: ["x"] })).toBe(true);
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

    test("returns true when called from a nested structure in another function", () => {
      const code = `function includes with str, target do
  for each character in str do
    if target == character do
      return true
    end
  end
  return false
end

function is_pangram with sentence do
  for each letter in "abcdefghijklmnopqrstuvwxyz" do
    if not includes(sentence, letter) do
      return false
    end
  end
  return true
end`;
      const result = interpret(code);
      expect(result.assertors.assertFunctionCalledOutsideOwnDefinition("includes")).toBe(true);
    });

    test("returns true on parse error", () => {
      const result = interpret("set set set");
      expect(result.assertors.assertFunctionCalledOutsideOwnDefinition("includes")).toBe(true);
    });
  });

  describe("numFunctionCallsInCode", () => {
    test("returns 0 when no function calls exist", () => {
      const result = interpret("set x to 5");
      expect(result.assertors.numFunctionCallsInCode("rectangle")).toBe(0);
    });

    test("counts one function call", () => {
      const result = interpret("rectangle(10, 20)");
      expect(result.assertors.numFunctionCallsInCode("rectangle")).toBe(1);
    });

    test("counts multiple calls of the same function", () => {
      const code = `rectangle(10, 20)
rectangle(30, 40)
rectangle(50, 60)`;
      const result = interpret(code);
      expect(result.assertors.numFunctionCallsInCode("rectangle")).toBe(3);
    });

    test("only counts the named function", () => {
      const code = `rectangle(10, 20)
circle(5)
rectangle(30, 40)`;
      const result = interpret(code);
      expect(result.assertors.numFunctionCallsInCode("rectangle")).toBe(2);
    });

    test("returns 0 on parse error", () => {
      const result = interpret("set set set");
      expect(result.assertors.numFunctionCallsInCode("rectangle")).toBe(0);
    });
  });
});
