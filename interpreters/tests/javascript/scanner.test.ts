import { scan } from "@javascript/scanner";
import { type TokenType } from "@javascript/token";
import { interpret } from "@javascript/interpreter";

describe("single-character", () => {
  test.each([
    ["{", "LEFT_BRACE"],
    // ["[", "LEFT_BRACKET"], // Unimplemented
    ["(", "LEFT_PAREN"],
    ["}", "RIGHT_BRACE"],
    // ["]", "RIGHT_BRACKET"], // Unimplemented
    [")", "RIGHT_PAREN"],
    [":", "COLON"],
    // [",", "COMMA"], // Unimplemented
    ["-", "MINUS"],
    ["+", "PLUS"],
    ["*", "STAR"],
    ["/", "SLASH"],
    ["=", "EQUAL"],
    ["!", "NOT"],
    // [".", "DOT"], // Unimplemented
    [";", "SEMICOLON"],
    // ["?", "QUESTION"], // Unimplemented
    ["%", "PERCENT"],
    // ["&", "AMPERSAND"], // Unimplemented
    // ["|", "PIPE"], // Unimplemented
    // ["^", "CARET"], // Unimplemented
    // ["~", "TILDE"], // Unimplemented
  ])("'%s' token", (source: string, expectedType: string) => {
    const tokens = scan(source);
    expect(tokens[0].type).toBe(expectedType as TokenType);
    expect(tokens[0].lexeme).toBe(source);
    expect(tokens[0].literal).toBeNull;
  });
});

describe("two-character operators", () => {
  test.each([
    [">", "GREATER"],
    [">=", "GREATER_EQUAL"],
    ["<", "LESS"],
    ["<=", "LESS_EQUAL"],
    ["!=", "NOT_EQUAL"],
    ["!==", "NOT_STRICT_EQUAL"],
    ["==", "EQUAL_EQUAL"],
    ["===", "STRICT_EQUAL"],
    ["&&", "LOGICAL_AND"],
    ["||", "LOGICAL_OR"],
    ["++", "INCREMENT"],
    ["--", "DECREMENT"],
    ["**", "STAR_STAR"],
    // ["+=", "PLUS_EQUAL"], // Unimplemented
    // ["-=", "MINUS_EQUAL"], // Unimplemented
    // ["*=", "MULTIPLY_EQUAL"], // Unimplemented
    // ["/=", "DIVIDE_EQUAL"], // Unimplemented
    // ["%=", "MODULO_EQUAL"], // Unimplemented
    // ["<<", "LEFT_SHIFT"], // Unimplemented
    // [">>", "RIGHT_SHIFT"], // Unimplemented
    // ["&=", "AND_EQUAL"], // Unimplemented
    // ["|=", "OR_EQUAL"], // Unimplemented
    // ["^=", "XOR_EQUAL"], // Unimplemented
    // ["=>", "ARROW"], // Unimplemented
  ])("'%s' token", (source: string, expectedType: string) => {
    const tokens = scan(source);
    expect(tokens[0].type).toBe(expectedType as TokenType);
    expect(tokens[0].lexeme).toBe(source);
    expect(tokens[0].literal).toBeNull;
  });
});

describe("keyword", () => {
  test.each([
    // ["break", "BREAK"], // Unimplemented
    // ["case", "CASE"], // Unimplemented
    // ["catch", "CATCH"], // Unimplemented
    // ["class", "CLASS"], // Unimplemented
    // ["const", "CONST"], // Unimplemented
    // ["continue", "CONTINUE"], // Unimplemented
    // ["debugger", "DEBUGGER"], // Unimplemented
    // ["default", "DEFAULT"], // Unimplemented
    // ["delete", "DELETE"], // Unimplemented
    // ["do", "DO"], // Unimplemented
    ["else", "ELSE"],
    // ["export", "EXPORT"], // Unimplemented
    // ["extends", "EXTENDS"], // Unimplemented
    ["false", "FALSE"],
    // ["finally", "FINALLY"], // Unimplemented
    ["for", "FOR"],
    // ["function", "FUNCTION"], // Unimplemented
    ["if", "IF"],
    // ["import", "IMPORT"], // Unimplemented
    // ["in", "IN"], // Unimplemented
    // ["instanceof", "INSTANCEOF"], // Unimplemented
    ["let", "LET"],
    // ["new", "NEW"], // Unimplemented
    ["null", "NULL"],
    // ["return", "RETURN"], // Unimplemented
    // ["super", "SUPER"], // Unimplemented
    // ["switch", "SWITCH"], // Unimplemented
    // ["this", "THIS"], // Unimplemented
    // ["throw", "THROW"], // Unimplemented
    ["true", "TRUE"],
    // ["try", "TRY"], // Unimplemented
    // ["typeof", "TYPEOF"], // Unimplemented
    ["undefined", "UNDEFINED"],
    // ["var", "VAR"], // Unimplemented
    // ["void", "VOID"], // Unimplemented
    ["while", "WHILE"],
    // ["with", "WITH"], // Unimplemented
    // ["yield", "YIELD"], // Unimplemented
  ])("'%s' keyword", (source: string, expectedType: string) => {
    const tokens = scan(source);
    expect(tokens[0].type).toBe(expectedType as TokenType);
    expect(tokens[0].lexeme).toBe(source);
    expect(tokens[0].literal).toBeNull;
  });
});

describe("string", () => {
  test("empty double quotes", () => {
    const tokens = scan('""');
    expect(tokens[0].type).toBe("STRING");
    expect(tokens[0].lexeme).toBe('""');
    expect(tokens[0].literal).toBe("");
  });

  test("empty single quotes", () => {
    const tokens = scan("''");
    expect(tokens[0].type).toBe("STRING");
    expect(tokens[0].lexeme).toBe("''");
    expect(tokens[0].literal).toBe("");
  });

  test("single character double quotes", () => {
    const tokens = scan('"a"');
    expect(tokens[0].type).toBe("STRING");
    expect(tokens[0].lexeme).toBe('"a"');
    expect(tokens[0].literal).toBe("a");
  });

  test("single character single quotes", () => {
    const tokens = scan("'a'");
    expect(tokens[0].type).toBe("STRING");
    expect(tokens[0].lexeme).toBe("'a'");
    expect(tokens[0].literal).toBe("a");
  });

  test("multiple characters", () => {
    const tokens = scan('"Hello"');
    expect(tokens[0].type).toBe("STRING");
    expect(tokens[0].lexeme).toBe('"Hello"');
    expect(tokens[0].literal).toBe("Hello");
  });

  test("containing whitespace", () => {
    const tokens = scan('" Good\tday! "');
    expect(tokens[0].type).toBe("STRING");
    expect(tokens[0].lexeme).toBe('" Good\tday! "');
    expect(tokens[0].literal).toBe(" Good\tday! ");
  });

  test("containing number", () => {
    const tokens = scan('"Testing 1,2,3"');
    expect(tokens[0].type).toBe("STRING");
    expect(tokens[0].lexeme).toBe('"Testing 1,2,3"');
    expect(tokens[0].literal).toBe("Testing 1,2,3");
  });

  test("escape sequences", () => {
    const tokens = scan('"Hello\\nWorld"');
    expect(tokens[0].type).toBe("STRING");
    expect(tokens[0].lexeme).toBe('"Hello\\nWorld"');
    expect(tokens[0].literal).toBe("Hello\nWorld");
  });
});

describe.skip("template literal", () => {
  test("empty", () => {
    const tokens = scan("``");
    expect(tokens.length).toBeGreaterThanOrEqual(2);
    expect(tokens[0].type).toBe("BACKTICK");
    expect(tokens[0].lexeme).toBe("`");
    expect(tokens[0].literal).toBeNull();
    expect(tokens[1].type).toBe("BACKTICK");
    expect(tokens[1].lexeme).toBe("`");
    expect(tokens[1].literal).toBeNull();
  });

  describe("text only", () => {
    test("single character", () => {
      const tokens = scan("`a`");
      expect(tokens.length).toBeGreaterThanOrEqual(3);
      expect(tokens[0].type).toBe("BACKTICK");
      expect(tokens[0].lexeme).toBe("`");
      expect(tokens[0].literal).toBeNull();
      expect(tokens[1].type).toBe("TEMPLATE_LITERAL_TEXT");
      expect(tokens[1].lexeme).toBe("a");
      expect(tokens[1].literal).toBe("a");
      expect(tokens[2].type).toBe("BACKTICK");
      expect(tokens[2].lexeme).toBe("`");
      expect(tokens[2].literal).toBeNull();
    });

    test("multiple characters", () => {
      const tokens = scan("`hello`");
      expect(tokens.length).toBeGreaterThanOrEqual(3);
      expect(tokens[0].type).toBe("BACKTICK");
      expect(tokens[0].lexeme).toBe("`");
      expect(tokens[0].literal).toBeNull();
      expect(tokens[1].type).toBe("TEMPLATE_LITERAL_TEXT");
      expect(tokens[1].lexeme).toBe("hello");
      expect(tokens[1].literal).toBe("hello");
      expect(tokens[2].type).toBe("BACKTICK");
      expect(tokens[2].lexeme).toBe("`");
      expect(tokens[2].literal).toBeNull();
    });

    test("containing whitespace", () => {
      const tokens = scan("` Good\tday! `");
      expect(tokens.length).toBeGreaterThanOrEqual(3);
      expect(tokens[0].type).toBe("BACKTICK");
      expect(tokens[0].lexeme).toBe("`");
      expect(tokens[0].literal).toBeNull();
      expect(tokens[1].type).toBe("TEMPLATE_LITERAL_TEXT");
      expect(tokens[1].lexeme).toBe(" Good\tday! ");
      expect(tokens[1].literal).toBe(" Good\tday! ");
      expect(tokens[2].type).toBe("BACKTICK");
      expect(tokens[2].lexeme).toBe("`");
      expect(tokens[2].literal).toBeNull();
    });
  });

  describe("placeholder only", () => {
    test("string", () => {
      const tokens = scan('`${"hello"}`');
      expect(tokens.length).toBeGreaterThanOrEqual(5);
      expect(tokens[0].type).toBe("BACKTICK");
      expect(tokens[0].lexeme).toBe("`");
      expect(tokens[0].literal).toBeNull();
      expect(tokens[1].type).toBe("DOLLAR_LEFT_BRACE");
      expect(tokens[1].lexeme).toBe("${");
      expect(tokens[1].literal).toBeNull();
      expect(tokens[2].type).toBe("STRING");
      expect(tokens[2].lexeme).toBe('"hello"');
      expect(tokens[2].literal).toBe("hello");
      expect(tokens[3].type).toBe("RIGHT_BRACE");
      expect(tokens[3].lexeme).toBe("}");
      expect(tokens[3].literal).toBeNull();
      expect(tokens[4].type).toBe("BACKTICK");
      expect(tokens[4].lexeme).toBe("`");
      expect(tokens[4].literal).toBeNull();
    });
  });
});

describe("identifier", () => {
  test("start with lower letter", () => {
    const tokens = scan("name");
    expect(tokens[0].type).toBe("IDENTIFIER");
    expect(tokens[0].lexeme).toBe("name");
    expect(tokens[0].literal).toBeNull;
  });

  test("start with upper letter", () => {
    const tokens = scan("Name");
    expect(tokens[0].type).toBe("IDENTIFIER");
    expect(tokens[0].lexeme).toBe("Name");
    expect(tokens[0].literal).toBeNull;
  });

  test("start with underscore", () => {
    const tokens = scan("_name");
    expect(tokens[0].type).toBe("IDENTIFIER");
    expect(tokens[0].lexeme).toBe("_name");
    expect(tokens[0].literal).toBeNull;
  });

  test("start with dollar sign", () => {
    const tokens = scan("$name");
    expect(tokens[0].type).toBe("IDENTIFIER");
    expect(tokens[0].lexeme).toBe("$name");
    expect(tokens[0].literal).toBeNull;
  });
});

describe("number", () => {
  test("integer", () => {
    const tokens = scan("143");
    expect(tokens[0].type).toBe("NUMBER");
    expect(tokens[0].lexeme).toBe("143");
    expect(tokens[0].literal).toBe(143);
  });

  test("floating-point", () => {
    const tokens = scan("76.9");
    expect(tokens[0].type).toBe("NUMBER");
    expect(tokens[0].lexeme).toBe("76.9");
    expect(tokens[0].literal).toBe(76.9);
  });

  test("scientific notation", () => {
    const tokens = scan("1e5");
    expect(tokens[0].type).toBe("NUMBER");
    expect(tokens[0].lexeme).toBe("1e5");
    expect(tokens[0].literal).toBe(100000);
  });

  test("hexadecimal", () => {
    const tokens = scan("0xFF");
    expect(tokens[0].type).toBe("NUMBER");
    expect(tokens[0].lexeme).toBe("0xFF");
    expect(tokens[0].literal).toBe(255);
  });

  test("octal", () => {
    const tokens = scan("0o77");
    expect(tokens[0].type).toBe("NUMBER");
    expect(tokens[0].lexeme).toBe("0o77");
    expect(tokens[0].literal).toBe(63);
  });

  test("binary", () => {
    const tokens = scan("0b101");
    expect(tokens[0].type).toBe("NUMBER");
    expect(tokens[0].lexeme).toBe("0b101");
    expect(tokens[0].literal).toBe(5);
  });
});

describe.skip("function call", () => {
  test("without arguments", () => {
    const tokens = scan("console.log();");
    expect(tokens).toBeArrayOfSize(8);
    expect(tokens[0].type).toBe("IDENTIFIER");
    expect(tokens[1].type).toBe("DOT");
    expect(tokens[2].type).toBe("IDENTIFIER");
    expect(tokens[3].type).toBe("LEFT_PAREN");
    expect(tokens[4].type).toBe("RIGHT_PAREN");
    expect(tokens[5].type).toBe("SEMICOLON");
    expect(tokens[6].type).toBe("EOL");
    expect(tokens[7].type).toBe("EOF");
  });

  test("single string argument", () => {
    const tokens = scan('console.log("hello");');
    expect(tokens).toBeArrayOfSize(9);
    expect(tokens[0].type).toBe("IDENTIFIER");
    expect(tokens[1].type).toBe("DOT");
    expect(tokens[2].type).toBe("IDENTIFIER");
    expect(tokens[3].type).toBe("LEFT_PAREN");
    expect(tokens[4].type).toBe("STRING");
    expect(tokens[5].type).toBe("RIGHT_PAREN");
    expect(tokens[6].type).toBe("SEMICOLON");
    expect(tokens[7].type).toBe("EOL");
    expect(tokens[8].type).toBe("EOF");
  });
});

describe("comments", () => {
  test("single line comment", () => {
    const tokens = scan("// This is a comment\nlet x = 5;");
    expect(tokens[0].type).toBe("LET");
    expect(tokens[1].type).toBe("IDENTIFIER");
    expect(tokens[2].type).toBe("EQUAL");
    expect(tokens[3].type).toBe("NUMBER");
    expect(tokens[4].type).toBe("SEMICOLON");
  });

  test("multi-line comment", () => {
    const tokens = scan("/* This is a\nmulti-line comment */\nlet x = 5;");
    expect(tokens[0].type).toBe("LET");
    expect(tokens[1].type).toBe("IDENTIFIER");
    expect(tokens[2].type).toBe("EQUAL");
    expect(tokens[3].type).toBe("NUMBER");
    expect(tokens[4].type).toBe("SEMICOLON");
  });
});

test.skip("multiple lines", () => {
  const tokens = scan('let x = 5;\nconsole.log("hello");\nx++;');
  expect(tokens).toBeArrayOfSize(15);
  expect(tokens[0].type).toBe("LET");
  expect(tokens[1].type).toBe("IDENTIFIER");
  expect(tokens[2].type).toBe("EQUAL");
  expect(tokens[3].type).toBe("NUMBER");
  expect(tokens[4].type).toBe("SEMICOLON");
  expect(tokens[5].type).toBe("EOL");
  expect(tokens[6].type).toBe("IDENTIFIER");
  expect(tokens[7].type).toBe("DOT");
  expect(tokens[8].type).toBe("IDENTIFIER");
  expect(tokens[9].type).toBe("LEFT_PAREN");
  expect(tokens[10].type).toBe("STRING");
  expect(tokens[11].type).toBe("RIGHT_PAREN");
  expect(tokens[12].type).toBe("SEMICOLON");
  expect(tokens[13].type).toBe("EOL");
  expect(tokens[14].type).toBe("EOF");
});

test.skip("location tracking", () => {
  const tokens = scan('let x = 5;\nconsole.log("hello");');
  expect(tokens).toBeArrayOfSize(12);

  expect(tokens[0].location.line).toBe(1);
  expect(tokens[0].location.relative.begin).toBe(1);
  expect(tokens[0].location.relative.end).toBe(4);
  expect(tokens[0].location.absolute.begin).toBe(1);
  expect(tokens[0].location.absolute.end).toBe(4);

  expect(tokens[6].location.line).toBe(2);
  expect(tokens[6].location.relative.begin).toBe(1);
  expect(tokens[6].location.relative.end).toBe(8);
  expect(tokens[6].location.absolute.begin).toBe(11);
  expect(tokens[6].location.absolute.end).toBe(18);
});

describe.skip("error", () => {
  describe("token", () => {
    test("invalid character", () => {
      expect(() => scan("let x = 5@")).toThrow("Unknown character: '@'.");
    });
  });
});

describe.skip("white space", () => {
  describe("ignore", () => {
    test("spaces", () => {
      const tokens = scan("    ");
      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe("EOF");
    });

    test("tabs", () => {
      const tokens = scan("\t\t\t");
      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe("EOF");
    });

    test("consecutive newlines", () => {
      const tokens = scan("\n\n\n\n");
      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe("EOF");
    });

    test("between statements", () => {
      const tokens = scan("let x = 1;\n\nlet y = 2;\n");
      expect(tokens).toHaveLength(11);
      expect(tokens[0].type).toBe("LET");
      expect(tokens[1].type).toBe("IDENTIFIER");
      expect(tokens[2].type).toBe("EQUAL");
      expect(tokens[3].type).toBe("NUMBER");
      expect(tokens[4].type).toBe("SEMICOLON");
      expect(tokens[5].type).toBe("EOL");
      expect(tokens[6].type).toBe("LET");
      expect(tokens[7].type).toBe("IDENTIFIER");
      expect(tokens[8].type).toBe("EQUAL");
      expect(tokens[9].type).toBe("NUMBER");
      expect(tokens[10].type).toBe("SEMICOLON");
    });
  });
});

describe.skip("synthetic", () => {
  describe("EOL", () => {
    describe("not added", () => {
      test("empty line", () => {
        const tokens = scan("");
        expect(tokens).toBeArrayOfSize(1);
        expect(tokens[0].type).toBe("EOF");
      });
    });

    describe("added", () => {
      test("single statement ending with semicolon", () => {
        const tokens = scan("let x = 5;");
        expect(tokens).toBeArrayOfSize(6);
        expect(tokens[0].type).toBe("LET");
        expect(tokens[1].type).toBe("IDENTIFIER");
        expect(tokens[2].type).toBe("EQUAL");
        expect(tokens[3].type).toBe("NUMBER");
        expect(tokens[4].type).toBe("SEMICOLON");
        expect(tokens[5].type).toBe("EOF");
      });

      test("single statement not ending with semicolon", () => {
        const tokens = scan("let x = 5");
        expect(tokens).toBeArrayOfSize(6);
        expect(tokens[0].type).toBe("LET");
        expect(tokens[1].type).toBe("IDENTIFIER");
        expect(tokens[2].type).toBe("EQUAL");
        expect(tokens[3].type).toBe("NUMBER");
        expect(tokens[4].type).toBe("EOL");
        expect(tokens[5].type).toBe("EOF");
      });
    });
  });
});

// TOKEN AVAILABILITY
// Tokens are categorized into:
// 1. Permanently Excluded - will never be available in this version of JavaScript
// 2. Not Yet Implemented - planned for future implementation
// When implementing a token, move it from this section to the appropriate section above
// and uncomment it in the test arrays.
describe("JavaScript - Token Availability", () => {
  describe("Permanently Excluded Tokens", () => {
    describe("Keywords", () => {
      const permanentlyExcludedKeywords = [
        { token: "var", type: "VAR" },
        { token: "with", type: "WITH" },
        { token: "debugger", type: "DEBUGGER" },
        { token: "void", type: "VOID" },
        { token: "yield", type: "YIELD" },
        { token: "delete", type: "DELETE" },
        { token: "import", type: "IMPORT" },
        { token: "export", type: "EXPORT" },
      ];

      permanentlyExcludedKeywords.forEach(({ token, type }) => {
        test(`should error on '${token}' keyword as permanently excluded`, () => {
          const result = interpret(`${token};`);
          expect(result.error).toBeDefined();
          expect(result.error?.type).toBe("PermanentlyExcludedToken");
          expect(result.error?.context).toEqual({
            tokenType: type,
            lexeme: token,
          });
        });
      });
    });

    describe("Bitwise Operators", () => {
      const permanentlyExcludedOperators = [
        { code: "5 & 3", token: "&", type: "AMPERSAND" },
        { code: "5 | 3", token: "|", type: "PIPE" },
        { code: "5 ^ 3", token: "^", type: "CARET" },
        { code: "~5", token: "~", type: "TILDE" },
        { code: "x << 2", token: "<<", type: "LEFT_SHIFT" },
        { code: "x >> 2", token: ">>", type: "RIGHT_SHIFT" },
        { code: "x &= 3", token: "&=", type: "AND_EQUAL" },
        { code: "x |= 3", token: "|=", type: "OR_EQUAL" },
        { code: "x ^= 3", token: "^=", type: "XOR_EQUAL" },
      ];

      permanentlyExcludedOperators.forEach(({ code, token, type }) => {
        test(`should error on '${token}' operator as permanently excluded`, () => {
          const result = interpret(code + ";");
          expect(result.error).toBeDefined();
          expect(result.error?.type).toBe("PermanentlyExcludedToken");
          expect(result.error?.context.tokenType).toBe(type);
        });
      });
    });
  });

  describe("Not Yet Implemented Tokens", () => {
    describe("Keywords", () => {
      const notYetImplementedKeywords = [
        { token: "case", type: "CASE" },
        { token: "catch", type: "CATCH" },
        { token: "class", type: "CLASS" },
        { token: "default", type: "DEFAULT" },
        { token: "do", type: "DO" },
        { token: "extends", type: "EXTENDS" },
        { token: "finally", type: "FINALLY" },
        { token: "instanceof", type: "INSTANCEOF" },
        { token: "super", type: "SUPER" },
        { token: "switch", type: "SWITCH" },
        { token: "this", type: "THIS" },
        { token: "throw", type: "THROW" },
        { token: "try", type: "TRY" },
        { token: "typeof", type: "TYPEOF" },
      ];

      notYetImplementedKeywords.forEach(({ token, type }) => {
        test(`should error on '${token}' keyword as not yet implemented`, () => {
          const result = interpret(`${token};`);
          expect(result.error).toBeDefined();
          expect(result.error?.type).toBe("UnimplementedToken");
          expect(result.error?.context).toEqual({
            tokenType: type,
            lexeme: token,
          });
        });
      });
    });

    describe("Operators", () => {
      const notYetImplementedOperators = [
        { code: "true ? 1 : 2", token: "?", type: "QUESTION" },
        { code: "() => 5", token: "=>", type: "ARROW" },
        { code: "x += 2", token: "+=", type: "PLUS_EQUAL" },
        { code: "x -= 2", token: "-=", type: "MINUS_EQUAL" },
        { code: "x *= 2", token: "*=", type: "MULTIPLY_EQUAL" },
        { code: "x /= 2", token: "/=", type: "DIVIDE_EQUAL" },
        { code: "x %= 2", token: "%=", type: "MODULO_EQUAL" },
      ];

      notYetImplementedOperators.forEach(({ code, token, type }) => {
        test(`should error on '${token}' operator as not yet implemented`, () => {
          const result = interpret(code + ";");
          expect(result.error).toBeDefined();
          expect(result.error?.type).toBe("UnimplementedToken");
          expect(result.error?.context.tokenType).toBe(type);
        });
      });
    });
  });

  describe("Disabled Language Features", () => {
    test("exclude list blocks tokens with correct error type", () => {
      const result = interpret("let x = 5;", {
        languageFeatures: { excludeList: ["LET"] },
      });
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe("DisabledFeatureExcludeListViolation");
    });

    test("include list blocks unlisted tokens with correct error type", () => {
      const result = interpret("let x = 5;", {
        languageFeatures: { includeList: ["NUMBER", "IDENTIFIER", "EQUAL", "SEMICOLON", "EOF"] },
      });
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe("DisabledFeatureIncludeListViolation");
    });
  });
});
