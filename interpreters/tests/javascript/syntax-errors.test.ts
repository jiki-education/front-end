import { parse } from "@javascript/parser";

describe("syntax errors", () => {
  describe("string errors", () => {
    test("unterminated string - end of file", () => {
      expect(() => parse('"hello')).toThrow("Did you forget to add end quote?");
    });

    test("unterminated string - end of line", () => {
      expect(() => parse('"hello\nsomething_else"')).toThrow(); // This seems to parse the first string successfully, then fail on missing semicolon
    });

    test("single quote unterminated string", () => {
      expect(() => parse("'hello")).toThrow("Did you forget to add end quote?");
    });

    test("mixed quote types", () => {
      expect(() => parse("\"hello'")).toThrow("Did you forget to add end quote?");
    });
  });

  describe("number errors", () => {
    test("multiple decimal points", () => {
      expect(() => parse("1.3.4;")).toThrow();
    });

    test("number ends with decimal point", () => {
      expect(() => parse("123.;")).toThrow();
    });

    test("invalid number format", () => {
      expect(() => parse("123abc;")).toThrow();
    });
  });

  describe("expression errors", () => {
    test("missing right parenthesis in grouping", () => {
      expect(() => parse("(1 + 2;")).toThrow("MissingRightParenthesisAfterExpression");
    });

    test("missing left parenthesis", () => {
      expect(() => parse("1 + 2);")).toThrow();
    });

    test("consecutive operators", () => {
      // This actually parses as 1 + (+2) which is valid in JavaScript
      const result = parse("1 + + 2;");
      expect(result).toBeArrayOfSize(1);
    });

    test("missing operand", () => {
      expect(() => parse("1 +;")).toThrow("MissingExpression");
    });

    test("unary plus is valid", () => {
      // Unary + is valid in JavaScript
      const result = parse("+ 2;");
      expect(result).toBeArrayOfSize(1);
    });

    test("empty parentheses", () => {
      expect(() => parse("();")).toThrow("MissingExpression");
    });

    test("nested parentheses missing close", () => {
      expect(() => parse("((1 + 2);")).toThrow("MissingRightParenthesisAfterExpression");
    });
  });

  describe("logical operator errors", () => {
    test("consecutive logical and operators", () => {
      expect(() => parse("true && && false;")).toThrow();
    });

    test("consecutive logical or operators", () => {
      expect(() => parse("true || || false;")).toThrow();
    });

    test("missing right operand in logical expression", () => {
      expect(() => parse("true &&;")).toThrow("MissingExpression");
    });

    test("missing left operand in logical expression", () => {
      expect(() => parse("&& false;")).toThrow();
    });

    test("mixed logical operators without operand", () => {
      expect(() => parse("true && || false;")).toThrow("MissingExpression");
    });
  });

  describe("comment errors", () => {
    test("unterminated multi-line comment", () => {
      expect(() => parse("/* hello world")).toThrow("Unknown character");
    });

    test("nested multi-line comments", () => {
      // JavaScript doesn't support nested comments, this should fail
      expect(() => parse("/* outer /* inner */ outer */")).toThrow();
    });
  });

  describe("semicolon errors", () => {
    test("missing semicolon after expression", () => {
      expect(() => parse("1 + 2")).toThrow("MissingSemicolon");
    });

    test("missing semicolon after string", () => {
      expect(() => parse('"hello"')).toThrow("MissingSemicolon");
    });

    test("missing semicolon after boolean", () => {
      expect(() => parse("true")).toThrow("MissingSemicolon");
    });

    test("multiple statements missing semicolon", () => {
      expect(() => parse("1; 2")).toThrow("MissingSemicolon");
    });
  });

  describe("complex expression errors", () => {
    test("unbalanced parentheses in complex expression", () => {
      expect(() => parse("(1 + (2 * 3);")).toThrow("MissingRightParenthesisAfterExpression");
    });

    test("missing operand in complex arithmetic", () => {
      expect(() => parse("1 + 2 *;")).toThrow("MissingExpression");
    });

    test("invalid operator sequence", () => {
      expect(() => parse("1 */ 2;")).toThrow();
    });

    test("string concatenation with missing operand", () => {
      expect(() => parse('"hello" +;')).toThrow("MissingExpression");
    });

    test("logical operation with arithmetic missing operand", () => {
      expect(() => parse("(1 + 2) &&;")).toThrow("MissingExpression");
    });
  });

  describe("variable declaration errors", () => {
    test("missing variable name after let", () => {
      expect(() => parse("let = 42;")).toThrow("MissingVariableName");
    });

    test("missing equals sign in variable declaration", () => {
      expect(() => parse("let x 42;")).toThrow("MissingInitializerInVariableDeclaration");
    });

    test("missing initializer in variable declaration", () => {
      expect(() => parse("let x =;")).toThrow("MissingExpression");
    });

    test("missing semicolon after variable declaration", () => {
      expect(() => parse("let x = 42")).toThrow("MissingSemicolon");
    });

    test("let keyword without declaration", () => {
      expect(() => parse("let;")).toThrow("MissingVariableName");
    });

    test("invalid variable name (number)", () => {
      expect(() => parse("let 123 = 42;")).toThrow("MissingVariableName");
    });

    test("invalid variable name (string)", () => {
      expect(() => parse('let "myvar" = 42;')).toThrow("MissingVariableName");
    });

    test("keyword as variable name", () => {
      expect(() => parse("let let = 42;")).toThrow("MissingVariableName");
    });

    test("multiple variable declarations without comma", () => {
      expect(() => parse("let x = 1 y = 2;")).toThrow();
    });
  });

  describe("identifier errors", () => {
    test("accessing undefined variable", () => {
      // This should parse fine, error will occur at runtime
      const result = parse("x;");
      expect(result).toBeArrayOfSize(1);
    });

    test("invalid identifier starting with number", () => {
      expect(() => parse("1abc;")).toThrow();
    });

    test("identifier with spaces", () => {
      expect(() => parse("my var;")).toThrow();
    });
  });

  describe("if statement errors", () => {
    test("missing left parenthesis after if", () => {
      expect(() => parse("if true) { let x = 5; }")).toThrow("MissingLeftParenthesisAfterIf");
    });

    test("missing right parenthesis after condition", () => {
      expect(() => parse("if (true { let x = 5; }")).toThrow("MissingRightParenthesisAfterIfCondition");
    });

    test("missing condition", () => {
      expect(() => parse("if () { let x = 5; }")).toThrow("MissingExpression");
    });

    test("if without parentheses", () => {
      expect(() => parse("if true { let x = 5; }")).toThrow("MissingLeftParenthesisAfterIf");
    });

    test("if with missing then statement", () => {
      expect(() => parse("if (true)")).toThrow();
    });

    test("nested missing parentheses", () => {
      expect(() => parse("if (true) { if false { let x = 1; } }")).toThrow("MissingLeftParenthesisAfterIf");
    });

    test("else without if", () => {
      expect(() => parse("else { let x = 5; }")).toThrow();
    });

    test("unbalanced parentheses in condition", () => {
      expect(() => parse("if ((true) { let x = 5; }")).toThrow("MissingRightParenthesisAfterIfCondition");
    });

    test("missing expression in condition with operator", () => {
      expect(() => parse("if (true &&) { let x = 5; }")).toThrow("MissingExpression");
    });
  });

  describe("edge cases", () => {
    test("empty input", () => {
      const result = parse("");
      expect(result).toBeArrayOfSize(0);
    });

    test("only whitespace", () => {
      const result = parse("   \n\t  ");
      expect(result).toBeArrayOfSize(0);
    });

    test("only comment", () => {
      const result = parse("// just a comment");
      expect(result).toBeArrayOfSize(0);
    });

    test("invalid character", () => {
      expect(() => parse("@invalid;")).toThrow();
    });

    test("unexpected token", () => {
      expect(() => parse("1 2 3;")).toThrow();
    });

    test("expression without semicolon followed by number", () => {
      expect(() => parse("1 + 2 3")).toThrow();
    });

    test("string without semicolon followed by another expression", () => {
      expect(() => parse('"hello" true')).toThrow();
    });

    test("boolean without semicolon followed by number", () => {
      expect(() => parse("true 42")).toThrow();
    });
  });
});
