import { describe, expect, it } from "vitest";
import { interpret } from "@python/interpreter";

// TOKEN AVAILABILITY
// This file tests token categorization:
// - Permanently excluded tokens: Features that will NEVER be available
// - Not yet implemented tokens: Features planned for future implementation
// - Disabled language features: Features disabled via excludeList/includeList

describe("Python - Token Availability", () => {
  describe("Permanently Excluded Tokens", () => {
    // These tokens are intentionally NOT supported due to
    // promoting confusing practices for learners.
    const permanentlyExcludedKeywords = [
      { token: "global", type: "GLOBAL" },
      { token: "nonlocal", type: "NONLOCAL" },
      { token: "assert", type: "ASSERT" },
    ];

    permanentlyExcludedKeywords.forEach(({ token, type }) => {
      it(`should error on '${token}' keyword as permanently excluded`, () => {
        const result = interpret(`${token}`);
        expect(result.error).toBeDefined();
        expect(result.error?.type).toBe("PermanentlyExcludedToken");
        expect(result.error?.context).toEqual({
          tokenType: type,
          lexeme: token,
        });
      });
    });
  });

  describe("Not Yet Implemented Tokens", () => {
    // These tokens are planned for future implementation.
    // Students see the same message as features disabled for their exercise level.
    const notYetImplementedKeywords = [
      { token: "as", type: "AS" },
      { token: "async", type: "ASYNC" },
      { token: "await", type: "AWAIT" },
      { token: "class", type: "CLASS" },
      { token: "del", type: "DEL" },
      { token: "except", type: "EXCEPT" },
      { token: "finally", type: "FINALLY" },
      { token: "from", type: "FROM" },
      { token: "import", type: "IMPORT" },
      { token: "is", type: "IS" },
      { token: "lambda", type: "LAMBDA" },
      { token: "pass", type: "PASS" },
      { token: "raise", type: "RAISE" },
      { token: "try", type: "TRY" },
      { token: "with", type: "WITH" },
      { token: "yield", type: "YIELD" },
    ];

    notYetImplementedKeywords.forEach(({ token, type }) => {
      it(`should error on '${token}' keyword as not yet implemented`, () => {
        const result = interpret(`${token}`);
        expect(result.error).toBeDefined();
        expect(result.error?.type).toBe("UnimplementedToken");
        expect(result.error?.context).toEqual({
          tokenType: type,
          lexeme: token,
        });
      });
    });

    describe("Not Yet Implemented Operators", () => {
      const notYetImplementedOperators = [{ code: "5;", token: ";", type: "SEMICOLON" }];

      notYetImplementedOperators.forEach(({ code, token, type }) => {
        it(`should error on '${token}' operator as not yet implemented`, () => {
          const result = interpret(code);
          expect(result.error).toBeDefined();
          expect(result.error?.type).toBe("UnimplementedToken");
          expect(result.error?.context.tokenType).toBe(type);
        });
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

  describe("Special operators", () => {
    it("should error on 'is' operator", () => {
      const result = interpret("a is b");
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe("UnimplementedToken");
      expect(result.error?.context.tokenType).toBe("IS");
    });
  });

  describe("Disabled Language Features", () => {
    it("should error when token is in excludeList", () => {
      const result = interpret("x = 5", {
        languageFeatures: { excludeList: ["IDENTIFIER"] },
      });
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe("DisabledFeatureExcludeListViolation");
      expect(result.error?.context.tokenType).toBe("IDENTIFIER");
    });

    it("should error when token is not in includeList", () => {
      const result = interpret("x = 5", {
        languageFeatures: { includeList: ["NUMBER", "EQUAL", "NEWLINE", "EOF"] },
      });
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe("DisabledFeatureIncludeListViolation");
      expect(result.error?.context.tokenType).toBe("IDENTIFIER");
    });

    it("should allow tokens when they are in includeList", () => {
      const result = interpret("5", {
        languageFeatures: { includeList: ["NUMBER", "NEWLINE", "EOF"] },
      });
      expect(result.error).toBeNull();
    });

    it("should allow tokens when they are not in excludeList", () => {
      const result = interpret("5", {
        languageFeatures: { excludeList: ["IDENTIFIER"] },
      });
      expect(result.error).toBeNull();
    });
  });
});
