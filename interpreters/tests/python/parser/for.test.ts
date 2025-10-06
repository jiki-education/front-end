import { describe, it, expect } from "vitest";
import { Parser } from "../../../src/python/parser";
import { ForInStatement, BreakStatement, ContinueStatement, BlockStatement } from "../../../src/python/statement";
import { IdentifierExpression, ListExpression } from "../../../src/python/expression";

describe("Python Parser - For Loops", () => {
  describe("Basic for-in loops", () => {
    it("should parse a simple for loop over a list", () => {
      const parser = new Parser({});
      const code = `for x in [1, 2, 3]:
    x`;

      const statements = parser.parse(code);

      expect(statements).toHaveLength(1);
      expect(statements[0]).toBeInstanceOf(ForInStatement);

      const forLoop = statements[0] as ForInStatement;
      expect(forLoop.variable.lexeme).toBe("x");
      expect(forLoop.iterable).toBeInstanceOf(ListExpression);
      expect(forLoop.body).toHaveLength(1);
    });

    it("should parse a for loop over an identifier", () => {
      const parser = new Parser({});
      const code = `for item in items:
    item`;

      const statements = parser.parse(code);

      expect(statements).toHaveLength(1);
      expect(statements[0]).toBeInstanceOf(ForInStatement);

      const forLoop = statements[0] as ForInStatement;
      expect(forLoop.variable.lexeme).toBe("item");
      expect(forLoop.iterable).toBeInstanceOf(IdentifierExpression);
      expect(forLoop.body).toHaveLength(1);
    });

    it("should parse a for loop with multiple statements in body", () => {
      const parser = new Parser({});
      const code = `for n in numbers:
    n = n + 1
    total = total + n`;

      const statements = parser.parse(code);

      expect(statements).toHaveLength(1);
      expect(statements[0]).toBeInstanceOf(ForInStatement);

      const forLoop = statements[0] as ForInStatement;
      expect(forLoop.body).toHaveLength(2);
    });

    it("should parse an empty for loop", () => {
      const parser = new Parser({});
      const code = `for x in []:
    x`; // Use x instead of pass since pass is not implemented

      const statements = parser.parse(code);

      expect(statements).toHaveLength(1);
      expect(statements[0]).toBeInstanceOf(ForInStatement);

      const forLoop = statements[0] as ForInStatement;
      expect(forLoop.variable.lexeme).toBe("x");
      expect(forLoop.body).toHaveLength(1);
    });
  });

  describe("Break and Continue statements", () => {
    it("should parse a break statement", () => {
      const parser = new Parser({});
      const code = `for x in items:
    break`;

      const statements = parser.parse(code);

      expect(statements).toHaveLength(1);
      const forLoop = statements[0] as ForInStatement;
      expect(forLoop.body).toHaveLength(1);
      expect(forLoop.body[0]).toBeInstanceOf(BreakStatement);
    });

    it("should parse a continue statement", () => {
      const parser = new Parser({});
      const code = `for x in items:
    continue`;

      const statements = parser.parse(code);

      expect(statements).toHaveLength(1);
      const forLoop = statements[0] as ForInStatement;
      expect(forLoop.body).toHaveLength(1);
      expect(forLoop.body[0]).toBeInstanceOf(ContinueStatement);
    });

    it("should parse a loop with both break and continue", () => {
      const parser = new Parser({});
      const code = `for x in items:
    if x > 5:
        break
    if x < 0:
        continue
    x`;

      const statements = parser.parse(code);

      expect(statements).toHaveLength(1);
      const forLoop = statements[0] as ForInStatement;
      expect(forLoop.body).toHaveLength(3); // Two if statements and one expression
    });
  });

  describe("Nested for loops", () => {
    it("should parse nested for loops", () => {
      const parser = new Parser({});
      const code = `for x in [1, 2]:
    for y in [3, 4]:
        x + y`;

      const statements = parser.parse(code);

      expect(statements).toHaveLength(1);
      const outerLoop = statements[0] as ForInStatement;
      expect(outerLoop.body).toHaveLength(1);

      const innerLoop = outerLoop.body[0] as ForInStatement;
      expect(innerLoop).toBeInstanceOf(ForInStatement);
      expect(innerLoop.variable.lexeme).toBe("y");
      expect(innerLoop.body).toHaveLength(1);
    });
  });

  describe("Syntax errors", () => {
    it("should throw error for missing variable name", () => {
      const parser = new Parser({});
      const code = `for in items:
    x`;

      expect(() => parser.parse(code)).toThrow("MissingIdentifier");
    });

    it("should throw error for missing 'in' keyword", () => {
      const parser = new Parser({});
      const code = `for x items:
    x`;

      expect(() => parser.parse(code)).toThrow("MissingIn");
    });

    it("should throw error for missing colon", () => {
      const parser = new Parser({});
      const code = `for x in items
    x`;

      expect(() => parser.parse(code)).toThrow("MissingColon");
    });

    it("should throw error for missing indented block", () => {
      const parser = new Parser({});
      const code = `for x in items:
x`;

      expect(() => parser.parse(code)).toThrow("MissingIndent");
    });
  });
});
