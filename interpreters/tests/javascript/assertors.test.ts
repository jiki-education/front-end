import { describe, test, expect } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { ExternalFunction } from "@shared/interfaces";

describe("JavaScript functionCallLog", () => {
  test("logs external function calls with args and return values", () => {
    const addFn: ExternalFunction = {
      name: "add",
      func: (_ctx: any, a: any, b: any) => a.value + b.value,
      description: "Add two numbers",
      arity: 2,
    };
    const result = interpret("let x = add(3, 4);", { externalFunctions: [addFn] });
    expect(result.meta.functionCallLog).toEqual([{ name: "add", args: [3, 4], return: 7 }]);
  });

  test("logs multiple calls in order", () => {
    const incFn: ExternalFunction = {
      name: "inc",
      func: (_ctx: any, a: any) => a.value + 1,
      description: "Increment",
      arity: 1,
    };
    const result = interpret("let x = inc(1);\nlet y = inc(5);", { externalFunctions: [incFn] });
    expect(result.meta.functionCallLog).toEqual([
      { name: "inc", args: [1], return: 2 },
      { name: "inc", args: [5], return: 6 },
    ]);
  });

  test("logs user-defined function calls", () => {
    const result = interpret("function double(n) { return n * 2; }\nlet x = double(5);");
    expect(result.meta.functionCallLog).toEqual([{ name: "double", args: [5], return: 10 }]);
  });

  test("logs stdlib function calls", () => {
    const result = interpret("let x = Math.randomInt(5,10);", { randomSeed: 1 });
    expect(result.meta.functionCallLog).toEqual([{ name: "Math.randomInt", args: [5, 10], return: 8 }]);
  });

  test("returns empty array on parse error", () => {
    const result = interpret("let let let");
    expect(result.meta.functionCallLog).toEqual([]);
  });

  test("returns empty array when no functions are called", () => {
    const result = interpret("let x = 5;");
    expect(result.meta.functionCallLog).toEqual([]);
  });
});

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

  describe("assertSomeArgumentsAreVariablesForFunction", () => {
    test("returns true when flagged args are variables", () => {
      const result = interpret("let x = 1;\nlet y = 2;\ndrawCircle(x, y, 10);");
      expect(result.assertors.assertSomeArgumentsAreVariablesForFunction("draw_circle", [true, true, false])).toBe(
        true
      );
    });

    test("returns false when a flagged arg is a literal", () => {
      const result = interpret("drawCircle(100, 200, 10);");
      expect(result.assertors.assertSomeArgumentsAreVariablesForFunction("draw_circle", [true, true, false])).toBe(
        false
      );
    });

    test("returns false when a flagged arg is a negative literal", () => {
      const result = interpret("drawCircle(-100, 200, 10);");
      expect(result.assertors.assertSomeArgumentsAreVariablesForFunction("draw_circle", [true, false, false])).toBe(
        false
      );
    });

    test("ignores unflagged literal args", () => {
      const result = interpret("let x = 1;\ndrawCircle(x, 200, 10);");
      expect(result.assertors.assertSomeArgumentsAreVariablesForFunction("draw_circle", [true, false, false])).toBe(
        true
      );
    });

    test("checks all calls to the same function", () => {
      const result = interpret("let x = 1;\ndrawCircle(x, 1, 1);\ndrawCircle(5, 1, 1);");
      expect(result.assertors.assertSomeArgumentsAreVariablesForFunction("draw_circle", [true, false, false])).toBe(
        false
      );
    });

    test("ignores calls to other functions", () => {
      const result = interpret("otherFunc(5);\nlet x = 1;\ndrawCircle(x, 1, 1);");
      expect(result.assertors.assertSomeArgumentsAreVariablesForFunction("draw_circle", [true, false, false])).toBe(
        true
      );
    });

    test("returns true when function is not called at all", () => {
      const result = interpret("let x = 5;");
      expect(result.assertors.assertSomeArgumentsAreVariablesForFunction("draw_circle", [true])).toBe(true);
    });

    test("returns true on parse error", () => {
      const result = interpret("let let let");
      expect(result.assertors.assertSomeArgumentsAreVariablesForFunction("draw_circle", [true])).toBe(true);
    });
  });

  describe("assertNoLiteralNumberAssignments", () => {
    test("returns true when no assignments have number literals", () => {
      const result = interpret("let x = 5;\nlet y = x + x;");
      expect(result.assertors.assertNoLiteralNumberAssignments({ include: ["y"] })).toBe(true);
    });

    test("returns false when included variable is assigned a number literal", () => {
      const result = interpret("let x = 5;\nlet y = 10;");
      expect(result.assertors.assertNoLiteralNumberAssignments({ include: ["x", "y"] })).toBe(false);
    });

    test("returns false when included variable is assigned a negative number literal", () => {
      const result = interpret("let x = -5;");
      expect(result.assertors.assertNoLiteralNumberAssignments({ include: ["x"] })).toBe(false);
    });

    test("skips variables not in include list", () => {
      const result = interpret("let x = 5;\nlet y = 10;");
      expect(result.assertors.assertNoLiteralNumberAssignments({ include: ["z"] })).toBe(true);
    });

    test("skips excluded variables", () => {
      const result = interpret("let x = 5;\nlet y = 10;");
      expect(result.assertors.assertNoLiteralNumberAssignments({ exclude: ["x", "y"] })).toBe(true);
    });

    test("only checks top-level value", () => {
      const result = interpret("let x = 5;\nlet y = x + 3;");
      expect(result.assertors.assertNoLiteralNumberAssignments({ include: ["y"] })).toBe(true);
    });

    test("returns true on parse error", () => {
      const result = interpret("let let let");
      expect(result.assertors.assertNoLiteralNumberAssignments({ include: ["x"] })).toBe(true);
    });
  });

  describe("assertNoLiteralNumbersInAssignments", () => {
    test("returns true when assignment uses only variables", () => {
      const result = interpret("let x = 5;\nlet y = x + x;");
      expect(result.assertors.assertNoLiteralNumbersInAssignments({ include: ["y"] })).toBe(true);
    });

    test("returns false when expression contains a number literal", () => {
      const result = interpret("let x = 5;\nlet y = x + 3;");
      expect(result.assertors.assertNoLiteralNumbersInAssignments({ include: ["y"] })).toBe(false);
    });

    test("returns false for direct number literal assignment", () => {
      const result = interpret("let x = 10;");
      expect(result.assertors.assertNoLiteralNumbersInAssignments({ include: ["x"] })).toBe(false);
    });

    test("skips variables not in include list", () => {
      const result = interpret("let x = 5;\nlet y = x + 3;");
      expect(result.assertors.assertNoLiteralNumbersInAssignments({ include: ["z"] })).toBe(true);
    });

    test("skips excluded variables", () => {
      const result = interpret("let x = 5;\nlet y = x + 3;");
      expect(result.assertors.assertNoLiteralNumbersInAssignments({ exclude: ["x", "y"] })).toBe(true);
    });

    test("allows string literals in expression", () => {
      const result = interpret('let x = "hello";');
      expect(result.assertors.assertNoLiteralNumbersInAssignments({ include: ["x"] })).toBe(true);
    });

    test("checks all assignments when no include or exclude", () => {
      const result = interpret("let x = 5;\nlet y = x + 3;");
      expect(result.assertors.assertNoLiteralNumbersInAssignments({})).toBe(false);
    });

    test("returns true on parse error", () => {
      const result = interpret("let let let");
      expect(result.assertors.assertNoLiteralNumbersInAssignments({ include: ["x"] })).toBe(true);
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

  describe("numFunctionCallsInCode", () => {
    test("returns 0 when no function calls exist", () => {
      const result = interpret("let x = 5;");
      expect(result.assertors.numFunctionCallsInCode("rectangle")).toBe(0);
    });

    test("counts one function call", () => {
      const result = interpret("rectangle(10, 20);");
      expect(result.assertors.numFunctionCallsInCode("rectangle")).toBe(1);
    });

    test("counts multiple calls of the same function", () => {
      const code = `rectangle(10, 20);
rectangle(30, 40);
rectangle(50, 60);`;
      const result = interpret(code);
      expect(result.assertors.numFunctionCallsInCode("rectangle")).toBe(3);
    });

    test("only counts the named function", () => {
      const code = `rectangle(10, 20);
circle(5);
rectangle(30, 40);`;
      const result = interpret(code);
      expect(result.assertors.numFunctionCallsInCode("rectangle")).toBe(2);
    });

    test("returns 0 on parse error", () => {
      const result = interpret("let let let");
      expect(result.assertors.numFunctionCallsInCode("rectangle")).toBe(0);
    });
  });
});
