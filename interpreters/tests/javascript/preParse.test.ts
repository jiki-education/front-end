import { parse } from "@javascript/parser";

describe("preParse: adjacent identifiers", () => {
  describe("triggers MissingDeclarationKeywordWithSuggestion", () => {
    test("typo of 'const' at top level", () => {
      expect(() => parse("cons foo = 1;")).toThrow("MissingDeclarationKeywordWithSuggestion");
    });

    test("typo of 'let' at top level", () => {
      expect(() => parse("lt x = 5;")).toThrow("MissingDeclarationKeywordWithSuggestion");
    });

    test("typo inside for...of header (the motivating bug)", () => {
      expect(() => parse("for (cons letter of str1) { }")).toThrow("MissingDeclarationKeywordWithSuggestion");
    });

    test("typo inside C-style for header", () => {
      expect(() => parse("for (cons i = 0; i < 10; i++) { }")).toThrow("MissingDeclarationKeywordWithSuggestion");
    });

    test("error message includes the suggestion and the misspelt name", () => {
      try {
        parse("cons foo = 1;");
        throw new Error("expected parse to throw");
      } catch (err: any) {
        expect(err.type).toBe("MissingDeclarationKeywordWithSuggestion");
        expect(err.context).toMatchObject({ name: "cons", suggestion: "const" });
      }
    });
  });

  describe("triggers UnexpectedDoubleIdentifier (no suggestion)", () => {
    test("two identifiers with no near-match to a keyword", () => {
      expect(() => parse("xyzzy foo = 1;")).toThrow("UnexpectedDoubleIdentifier");
    });
  });

  describe("does not trigger on valid code", () => {
    test("normal let declaration", () => {
      expect(() => parse("let x = 1;")).not.toThrow();
    });

    test("normal const declaration", () => {
      expect(() => parse("const y = 2;")).not.toThrow();
    });

    test("for...of with let", () => {
      expect(() => parse("for (let letter of [1,2,3]) { }")).not.toThrow();
    });

    test("C-style for with let init", () => {
      expect(() => parse("for (let i = 0; i < 10; i = i + 1) { }")).not.toThrow();
    });

    test("two statements separated by EOL", () => {
      expect(() => parse("let foo = 1;\nlet bar = 2;")).not.toThrow();
    });

    test("two statements separated by SEMICOLON on one line", () => {
      expect(() => parse("let foo = 1; let bar = 2;")).not.toThrow();
    });

    test("blocks with adjacent identifiers across braces", () => {
      expect(() => parse("if (true) { let foo = 1; } { let bar = 2; }")).not.toThrow();
    });
  });
});
