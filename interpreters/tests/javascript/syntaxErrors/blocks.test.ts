import { parse } from "@javascript/parser";
import { SyntaxError } from "@javascript/error";

describe("block syntax errors", () => {
  test("missing right brace throws error", () => {
    expect(() => parse("{ 42;")).toThrow(SyntaxError);

    try {
      parse("{ 42;");
    } catch (error) {
      expect(error).toBeInstanceOf(SyntaxError);
      expect((error as SyntaxError).type).toBe("MissingRightBraceAfterBlock");
    }
  });

  test("missing right brace in nested blocks throws error", () => {
    expect(() => parse("{ { 42; }")).toThrow(SyntaxError);

    try {
      parse("{ { 42; }");
    } catch (error) {
      expect(error).toBeInstanceOf(SyntaxError);
      expect((error as SyntaxError).type).toBe("MissingRightBraceAfterBlock");
    }
  });

  test("unexpected right brace throws error", () => {
    expect(() => parse("42; }")).toThrow(SyntaxError);
  });

  test("multiple missing right braces", () => {
    expect(() => parse("{ { { 42;")).toThrow(SyntaxError);
  });

  test("mismatched braces in complex expression", () => {
    expect(() => parse("{ let x = 42; { x; }")).toThrow(SyntaxError);

    try {
      parse("{ let x = 42; { x; }");
    } catch (error) {
      expect(error).toBeInstanceOf(SyntaxError);
      expect((error as SyntaxError).type).toBe("MissingRightBraceAfterBlock");
    }
  });

  test("empty unclosed block", () => {
    expect(() => parse("{")).toThrow(SyntaxError);

    try {
      parse("{");
    } catch (error) {
      expect(error).toBeInstanceOf(SyntaxError);
      expect((error as SyntaxError).type).toBe("MissingRightBraceAfterBlock");
    }
  });

  test("block with invalid statement structure", () => {
    // This should fail due to missing semicolon, not block structure
    expect(() => parse("{ let x = }")).toThrow(SyntaxError);
  });
});
