import { describe, test, expect } from "vitest";
import { parse } from "@javascript/parser";
import enMessages from "../../src/javascript/locales/en/translation.json";

// Parses the code and returns the error it throws, or null if it parses.
function parseError(code: string, english = false): any {
  try {
    parse(code, english ? { localeMessages: enMessages } : {});
    return null;
  } catch (e) {
    return e;
  }
}

describe("function names in call errors", () => {
  test.each([
    ["plain function", "move(1", "move"],
    ["method on an identifier", "console.log(1", "console.log"],
    ["method on a dotted path", "a.b.c(1", "a.b.c"],
    ["method on a string literal", `"abc".repeat(1`, "repeat"],
    ["method on an indexed value", "arr[0].push(1", "push"],
    ["method on a call result", "foo().bar(1", "bar"],
  ])("%s", (_, code, name) => {
    const error = parseError(code);
    expect(error.type).toBe("MissingRightParenthesisAfterFunctionCall");
    expect(error.message).toBe(`MissingRightParenthesisAfterFunctionCall: function: ${name}`);
  });

  test("English names a method call by its dotted path", () => {
    expect(parseError("console.log(1", true).message).toBe(
      "Did you forget the closing parenthesis `)` when calling the console.log function?"
    );
  });

  describe("callees with no name", () => {
    test.each([
      ["call on a call result", "foo()(1"],
      ["call on an indexed value", "arr[0](1"],
      ["call on a grouping", "(foo)(1"],
    ])("%s uses the unnamed wording", (_, code) => {
      const error = parseError(code, true);
      expect(error.type).toBe("MissingRightParenthesisAfterFunctionCall");
      expect(error.message).toBe("Did you forget the closing parenthesis `)` when calling this function?");
    });

    test("never says null", () => {
      expect(parseError("foo()(1", true).message).not.toContain("null");
      expect(parseError("foo()(1").message).not.toContain("null");
    });
  });

  describe("missing comma errors use the same names", () => {
    test("method call", () => {
      const error = parseError("console.log(1 2)");
      expect(error.type).toBe("MissingCommaBetweenFunctionArguments");
      expect(error.message).toBe("MissingCommaBetweenFunctionArguments: function: console.log");
    });

    test("unnamed callee", () => {
      const error = parseError("foo()(1 2)", true);
      expect(error.type).toBe("MissingCommaBetweenFunctionArguments");
      expect(error.message).toBe("Did you forget a comma `,` between the inputs when calling this function?");
    });
  });

  test("an unclosed call straight after the paren also names the method", () => {
    expect(parseError("console.log(").message).toBe("MissingRightParenthesisAfterFunctionCall: function: console.log");
  });
});
