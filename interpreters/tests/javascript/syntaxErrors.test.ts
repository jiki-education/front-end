import { parse } from "@javascript/parser";

describe("Function Call Syntax Errors", () => {
  describe("MissingRightParenthesisAfterFunctionCall", () => {
    describe("single line", () => {
      test("no arguments", () => {
        expect(() => parse("move(")).toThrow("MissingRightParenthesisAfterFunctionCall");
      });

      test("no arguments with semicolon", () => {
        expect(() => parse("move(;")).toThrow("MissingRightParenthesisAfterFunctionCall");
      });

      test("one argument", () => {
        expect(() => parse("move(1")).toThrow("MissingRightParenthesisAfterFunctionCall");
      });

      test("one argument with semicolon", () => {
        expect(() => parse("move(1;")).toThrow("MissingRightParenthesisAfterFunctionCall");
      });

      test("two arguments", () => {
        expect(() => parse("move(1, 2")).toThrow("MissingRightParenthesisAfterFunctionCall");
      });

      test("two arguments with semicolon", () => {
        expect(() => parse("move(1, 2;")).toThrow("MissingRightParenthesisAfterFunctionCall");
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

      test("no arguments with semicolons", () => {
        const code = `move();
move(;
move();`;
        expect(() => parse(code)).toThrow("MissingRightParenthesisAfterFunctionCall");
      });

      test("with semicolons required", () => {
        const code = `move();
move(
move();`;
        expect(() => parse(code, { languageFeatures: { requireSemicolons: true } })).toThrow(
          "MissingRightParenthesisAfterFunctionCall"
        );
      });
    });

    describe("multiple function calls - error on first unclosed", () => {
      test("two calls, first unclosed", () => {
        expect(() => parse("foo( bar()")).toThrow("MissingRightParenthesisAfterFunctionCall");
      });

      test("two calls, second unclosed", () => {
        // Without semicolons, this first fails on missing semicolon between statements
        // With semicolons, it would catch the unclosed paren
        expect(() => parse("foo() bar(")).toThrow("MissingSemicolon");
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
        expect(() => parse("calculateSomethingComplex(")).toThrow("MissingRightParenthesisAfterFunctionCall");
      });

      test("with underscores", () => {
        expect(() => parse("get_user_data(")).toThrow("MissingRightParenthesisAfterFunctionCall");
      });

      test("camelCase", () => {
        expect(() => parse("getUserData(")).toThrow("MissingRightParenthesisAfterFunctionCall");
      });
    });
  });
});
