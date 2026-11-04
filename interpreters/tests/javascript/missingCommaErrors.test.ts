import { describe, test, expect } from "vitest";
import { parse } from "@javascript/parser";

// Parses the code and returns the error it throws, or null if it parses.
function parseError(code: string): any {
  try {
    parse(code);
    return null;
  } catch (e) {
    return e;
  }
}

function expectError(code: string, type: string, begin?: number) {
  const error = parseError(code);
  expect(error?.type).toBe(type);
  if (begin !== undefined) {
    expect(error.location.relative.begin).toBe(begin);
  }
  return error;
}

describe("Missing commas", () => {
  describe("function calls", () => {
    test("valid calls still parse", () => {
      expect(parseError("foo(1,2) + foo(3,4)")).toBeNull();
    });

    test("foo(1 2)", () => {
      const error = expectError("foo(1 2)", "MissingCommaBetweenFunctionArguments", 7);
      expect(error.message).toBe("MissingCommaBetweenFunctionArguments: function: foo");
    });

    test("foo(1 2 (missing comma and paren reports the comma first)", () => {
      expectError("foo(1 2", "MissingCommaBetweenFunctionArguments", 7);
    });

    test("foo(1,2 is a missing paren", () => {
      expectError("foo(1,2", "MissingRightParenthesisAfterFunctionCall", 1);
    });

    test("foo(1 2 + foo(3,4)", () => {
      expectError("foo(1 2 + foo(3,4)", "MissingCommaBetweenFunctionArguments", 7);
    });

    test("foo(1,2 + foo(3,4) is a missing paren on the outer call", () => {
      const error = expectError("foo(1,2 + foo(3,4)", "MissingRightParenthesisAfterFunctionCall", 1);
      expect(error.message).toBe("MissingRightParenthesisAfterFunctionCall: function: foo");
    });

    test("foo(1 2) + foo(3,4)", () => {
      expectError("foo(1 2) + foo(3,4)", "MissingCommaBetweenFunctionArguments", 7);
    });

    test("foo(1, 2) + foo(3 4) reports the second call", () => {
      expectError("foo(1, 2) + foo(3 4)", "MissingCommaBetweenFunctionArguments", 19);
    });

    test("the original triangle bug", () => {
      const code = `triangle(10,5, 10,40,50,40 "orange")`;
      const error = expectError(code, "MissingCommaBetweenFunctionArguments", 28);
      expect(error.message).toBe("MissingCommaBetweenFunctionArguments: function: triangle");
    });

    describe("kinds of value after the argument", () => {
      test.each([
        ["string", `foo(1 "a")`],
        ["two strings", `foo("a" "b")`],
        ["identifiers", `foo(x y)`],
        ["true", `foo(1 true)`],
        ["false", `foo(1 false)`],
        ["null", `foo(1 null)`],
        ["undefined", `foo(1 undefined)`],
        ["template literal", "foo(1 `a`)"],
        ["negation", `foo(x !y)`],
      ])("%s", (_, code) => {
        expectError(code, "MissingCommaBetweenFunctionArguments");
      });
    });

    describe("valid JS that looks like a missing comma keeps parsing", () => {
      test.each([
        ["subtraction", `foo(1 -2)`],
        ["addition", `foo(1 +2)`],
        ["call on the previous identifier", `foo(x (2))`],
        ["index into the previous identifier", `foo(x [0])`],
      ])("%s", (_, code) => {
        expect(parseError(code)).toBeNull();
      });
    });

    describe("nesting", () => {
      test("inner missing comma names the inner function", () => {
        const error = expectError("foo(bar(1 2))", "MissingCommaBetweenFunctionArguments", 11);
        expect(error.message).toBe("MissingCommaBetweenFunctionArguments: function: bar");
      });

      test("outer missing paren names the outer function", () => {
        const error = expectError("foo(bar(1, 2)", "MissingRightParenthesisAfterFunctionCall", 1);
        expect(error.message).toBe("MissingRightParenthesisAfterFunctionCall: function: foo");
      });

      test("inner missing comma comes before outer missing paren", () => {
        expectError("foo(bar(1 2)", "MissingCommaBetweenFunctionArguments", 11);
      });

      test("missing comma inside an array argument is an array error", () => {
        expectError("foo([1 2])", "MissingCommaBetweenArrayElements", 8);
      });
    });

    describe("end of statement", () => {
      test("foo(1; is a missing paren", () => {
        expectError("foo(1;", "MissingRightParenthesisAfterFunctionCall");
      });

      test("foo(1 2; is a missing comma", () => {
        expectError("foo(1 2;", "MissingCommaBetweenFunctionArguments", 7);
      });

      test("a line break after an argument is a missing paren", () => {
        expectError("foo(1\n2)", "MissingRightParenthesisAfterFunctionCall");
      });
    });

    test("method calls", () => {
      expectError("console.log(1 2)", "MissingCommaBetweenFunctionArguments", 15);
      expectError("obj.foo(1 2)", "MissingCommaBetweenFunctionArguments", 11);
    });

    describe("statement contexts", () => {
      test("variable declaration", () => {
        expectError("let x = foo(1 2)", "MissingCommaBetweenFunctionArguments", 15);
      });

      test("if condition", () => {
        expectError("if (foo(1 2)) {\n}", "MissingCommaBetweenFunctionArguments", 11);
      });

      test("return", () => {
        const code = `function bar() {
  return foo(1 2)
}`;
        expectError(code, "MissingCommaBetweenFunctionArguments", 16);
      });
    });

    describe("adjacent identifiers outside argument lists keep their pre-parse errors", () => {
      test("if condition", () => {
        expectError("if (x y) {\n}", "UnexpectedDoubleIdentifier");
      });

      test("declaration keyword typo in a for header", () => {
        expectError("for (cons x of xs) {\n}", "MissingDeclarationKeywordWithSuggestion");
      });

      test("statement", () => {
        expectError("x y", "UnexpectedDoubleIdentifier");
      });

      test("function parameters", () => {
        expectError("function foo(a b) {\n}", "UnexpectedDoubleIdentifier");
      });
    });

    describe("neighbouring errors are unchanged", () => {
      test("trailing comma", () => {
        expectError("foo(1,)", "MissingExpression");
      });

      test("leading comma", () => {
        expectError("foo(,1)", "MissingExpression");
      });

      test("value after the closing paren", () => {
        expectError("foo(1)2", "MissingEndOfLine");
      });
    });
  });

  describe("arrays", () => {
    test("valid arrays still parse", () => {
      expect(parseError("let a = [1, 2, 3]")).toBeNull();
    });

    test("[1 2]", () => {
      const error = expectError("let a = [1 2]", "MissingCommaBetweenArrayElements", 12);
      expect(error.message).toBe("MissingCommaBetweenArrayElements");
    });

    test("[1, 2 3]", () => {
      expectError("let a = [1, 2 3]", "MissingCommaBetweenArrayElements", 15);
    });

    test("[1 2 (missing comma and bracket reports the comma first)", () => {
      expectError("let a = [1 2", "MissingCommaBetweenArrayElements", 12);
    });

    test("[1, 2 is a missing bracket", () => {
      expectError("let a = [1, 2", "MissingRightBracketInArray");
    });

    test.each([
      ["strings", `let a = ["a" "b"]`],
      ["identifiers", `let a = [x y]`],
      ["booleans", `let a = [true false]`],
    ])("%s", (_, code) => {
      expectError(code, "MissingCommaBetweenArrayElements");
    });

    test("subtraction keeps parsing", () => {
      expect(parseError("let a = [1 -2]")).toBeNull();
    });

    test("trailing comma is unchanged", () => {
      expectError("let a = [1, 2,]", "TrailingCommaInArray");
    });

    test("missing comma at the end of a line in a multi-line array is a missing bracket", () => {
      const code = `let a = [
  1,
  2
  3
]`;
      expectError(code, "MissingRightBracketInArray");
    });
  });
});
