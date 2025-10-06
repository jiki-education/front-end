import { parse } from "@javascript/parser";
import { ExpressionStatement } from "@javascript/statement";
import { LiteralExpression, BinaryExpression } from "@javascript/expression";

describe("strings", () => {
  describe("parse", () => {
    test("double quoted string", () => {
      const stmts = parse('"hello";');
      expect(stmts).toBeArrayOfSize(1);
      expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
      const exprStmt = stmts[0] as ExpressionStatement;
      expect(exprStmt.expression).toBeInstanceOf(LiteralExpression);
      expect((exprStmt.expression as LiteralExpression).value).toBe("hello");
    });

    test("single quoted string", () => {
      const stmts = parse("'hello';");
      expect(stmts).toBeArrayOfSize(1);
      expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
      const exprStmt = stmts[0] as ExpressionStatement;
      expect(exprStmt.expression).toBeInstanceOf(LiteralExpression);
      expect((exprStmt.expression as LiteralExpression).value).toBe("hello");
    });

    test("string with spaces", () => {
      const stmts = parse('"hello world";');
      expect(stmts).toBeArrayOfSize(1);
      expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
      const exprStmt = stmts[0] as ExpressionStatement;
      expect(exprStmt.expression).toBeInstanceOf(LiteralExpression);
      expect((exprStmt.expression as LiteralExpression).value).toBe("hello world");
    });

    test("string with escape sequences", () => {
      const stmts = parse('"hello\\nworld";');
      expect(stmts).toBeArrayOfSize(1);
      expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
      const exprStmt = stmts[0] as ExpressionStatement;
      expect(exprStmt.expression).toBeInstanceOf(LiteralExpression);
      expect((exprStmt.expression as LiteralExpression).value).toBe("hello\nworld");
    });

    test("empty string", () => {
      const stmts = parse('"";');
      expect(stmts).toBeArrayOfSize(1);
      expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
      const exprStmt = stmts[0] as ExpressionStatement;
      expect(exprStmt.expression).toBeInstanceOf(LiteralExpression);
      expect((exprStmt.expression as LiteralExpression).value).toBe("");
    });

    describe("string concatenation", () => {
      test("simple concatenation", () => {
        const stmts = parse('"hello" + "world";');
        expect(stmts).toBeArrayOfSize(1);
        expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
        const exprStmt = stmts[0] as ExpressionStatement;
        expect(exprStmt.expression).toBeInstanceOf(BinaryExpression);
        const binaryExpr = exprStmt.expression as BinaryExpression;
        expect(binaryExpr.operator.type).toBe("PLUS");
        expect((binaryExpr.left as LiteralExpression).value).toBe("hello");
        expect((binaryExpr.right as LiteralExpression).value).toBe("world");
      });

      test("multiple concatenation", () => {
        const stmts = parse('"hello" + " " + "world";');
        expect(stmts).toBeArrayOfSize(1);
        expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
        const exprStmt = stmts[0] as ExpressionStatement;
        expect(exprStmt.expression).toBeInstanceOf(BinaryExpression);
        const binaryExpr = exprStmt.expression as BinaryExpression;
        expect(binaryExpr.operator.type).toBe("PLUS");
        expect((binaryExpr.right as LiteralExpression).value).toBe("world");
        expect(binaryExpr.left).toBeInstanceOf(BinaryExpression);
      });
    });

    describe("template literals", () => {
      test.skip("basic template literal", () => {
        const stmts = parse("`hello world`;");
        expect(stmts).toBeArrayOfSize(1);
        // TODO: Add proper template literal assertions once parser is implemented
      });

      test.skip("template literal with expression", () => {
        const stmts = parse("`hello ${name}`;");
        expect(stmts).toBeArrayOfSize(1);
        // TODO: Add proper template literal assertions once parser is implemented
      });
    });
  });
});
