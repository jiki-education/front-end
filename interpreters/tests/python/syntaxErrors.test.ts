import { Parser } from "@python/parser";

function parse(code: string) {
  const parser = new Parser();
  return parser.parse(code);
}

describe("Function Call Syntax Errors", () => {
  describe("MissingRightParenthesisAfterFunctionCall", () => {
    describe("single line", () => {
      test("no arguments", () => {
        expect(() => parse("move(")).toThrow("MissingRightParenthesisAfterFunctionCall");
      });

      test("one argument", () => {
        expect(() => parse("move(1")).toThrow("MissingRightParenthesisAfterFunctionCall");
      });

      test("two arguments", () => {
        expect(() => parse("move(1, 2")).toThrow("MissingRightParenthesisAfterFunctionCall");
      });

      test("trailing comma", () => {
        // Trailing comma causes parse to look for another argument, then hits EOF
        // This results in MissingExpression which is also reasonable
        expect(() => parse("move(1, 2,")).toThrow("MissingExpression");
      });
    });

    describe("three lines - unclosed on line 2", () => {
      test("no arguments", () => {
        const code = `move()
move(
move()`;
        expect(() => parse(code)).toThrow("MissingRightParenthesisAfterFunctionCall");
      });

      test("with content after newline", () => {
        const code = `move()
move(
x`;
        expect(() => parse(code)).toThrow("MissingRightParenthesisAfterFunctionCall");
      });
    });

    describe("two lines - unclosed on line 2", () => {
      test("no arguments", () => {
        const code = `move()
move(`;
        expect(() => parse(code)).toThrow("MissingRightParenthesisAfterFunctionCall");
      });

      test("with argument", () => {
        const code = `move()
move(1`;
        expect(() => parse(code)).toThrow("MissingRightParenthesisAfterFunctionCall");
      });
    });

    describe("multiple function calls - error on first unclosed", () => {
      test("two calls, first unclosed", () => {
        expect(() => parse("foo( bar()")).toThrow("MissingRightParenthesisAfterFunctionCall");
      });
    });

    describe("nested function calls", () => {
      test("outer unclosed", () => {
        expect(() => parse("foo(bar()")).toThrow("MissingRightParenthesisAfterFunctionCall");
      });

      test("inner unclosed", () => {
        expect(() => parse("foo(bar(")).toThrow("MissingRightParenthesisAfterFunctionCall");
      });
    });

    describe("different function names", () => {
      test("short name", () => {
        expect(() => parse("a(")).toThrow("MissingRightParenthesisAfterFunctionCall");
      });

      test("long name", () => {
        expect(() => parse("calculate_something_complex(")).toThrow("MissingRightParenthesisAfterFunctionCall");
      });

      test("with underscores", () => {
        expect(() => parse("get_user_data(")).toThrow("MissingRightParenthesisAfterFunctionCall");
      });
    });
  });
});
