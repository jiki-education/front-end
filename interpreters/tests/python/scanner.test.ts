import { describe, expect, it } from "vitest";
import { interpret } from "../../src/python/interpreter";

// UNIMPLEMENTED TOKENS
// When implementing a token, move it from this section to the appropriate implemented section
// and create proper scanner tests for it.
describe("Python - Unimplemented Tokens", () => {
  describe("Unimplemented Keywords", () => {
    const unimplementedKeywords = [
      { token: "as", type: "AS" },
      { token: "assert", type: "ASSERT" },
      { token: "async", type: "ASYNC" },
      { token: "await", type: "AWAIT" },
      { token: "class", type: "CLASS" },
      { token: "del", type: "DEL" },
      { token: "except", type: "EXCEPT" },
      { token: "finally", type: "FINALLY" },
      { token: "from", type: "FROM" },
      { token: "global", type: "GLOBAL" },
      { token: "import", type: "IMPORT" },
      { token: "is", type: "IS" },
      { token: "lambda", type: "LAMBDA" },
      { token: "nonlocal", type: "NONLOCAL" },
      { token: "pass", type: "PASS" },
      { token: "raise", type: "RAISE" },
      { token: "try", type: "TRY" },
      { token: "with", type: "WITH" },
      { token: "yield", type: "YIELD" },
    ];

    unimplementedKeywords.forEach(({ token, type }) => {
      it(`should error on '${token}' keyword`, () => {
        const result = interpret(`${token}`);
        expect(result.error).toBeDefined();
        expect(result.error?.type).toBe("UnimplementedToken");
        expect(result.error?.context).toEqual({
          tokenType: type,
          lexeme: token,
        });
      });
    });
  });

  describe("Unimplemented Operators", () => {
    const unimplementedOperators = [{ code: "5;", token: ";", type: "SEMICOLON" }];

    unimplementedOperators.forEach(({ code, token, type }) => {
      it(`should error on '${token}' operator`, () => {
        const result = interpret(code);
        expect(result.error).toBeDefined();
        expect(result.error?.type).toBe("UnimplementedToken");
        expect(result.error?.context.tokenType).toBe(type);
      });
    });
  });

  describe("Compound statements", () => {
    it("should error on class definition", () => {
      const result = interpret("class Foo:\n    pass");
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe("UnimplementedToken");
      expect(result.error?.context.tokenType).toBe("CLASS");
    });

    it("should error on try statement", () => {
      const result = interpret("try:\n    pass\nexcept:\n    pass");
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe("UnimplementedToken");
      expect(result.error?.context.tokenType).toBe("TRY");
    });

    it("should error on with statement", () => {
      const result = interpret("with open('file') as f:\n    pass");
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe("UnimplementedToken");
      expect(result.error?.context.tokenType).toBe("WITH");
    });
  });

  // The 'not' operator is already implemented as a unary operator

  describe("Special operators", () => {
    it("should error on 'is' operator", () => {
      const result = interpret("a is b");
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe("UnimplementedToken");
      expect(result.error?.context.tokenType).toBe("IS");
    });

    // Commented out - 'in' is now implemented for for-in loops
    // it("should error on 'in' operator", () => {
    //   const result = interpret("a in b");
    //   expect(result.error).toBeDefined();
    //   expect(result.error?.type).toBe("UnimplementedToken");
    //   expect(result.error?.context.tokenType).toBe("IN");
    // });
  });
});
