import { parse } from "@javascript/parser";
import { ExpressionStatement } from "@javascript/statement";
import { LiteralExpression, BinaryExpression, LogicalExpression } from "@javascript/expression";

describe("booleans", () => {
  describe("parse", () => {
    describe("literals", () => {
      test("true", () => {
        const stmts = parse("true;");
        expect(stmts).toBeArrayOfSize(1);
        expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
        const exprStmt = stmts[0] as ExpressionStatement;
        expect(exprStmt.expression).toBeInstanceOf(LiteralExpression);
        expect((exprStmt.expression as LiteralExpression).value).toBe(true);
      });

      test("false", () => {
        const stmts = parse("false;");
        expect(stmts).toBeArrayOfSize(1);
        expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
        const exprStmt = stmts[0] as ExpressionStatement;
        expect(exprStmt.expression).toBeInstanceOf(LiteralExpression);
        expect((exprStmt.expression as LiteralExpression).value).toBe(false);
      });
    });

    describe("logical operations", () => {
      test("logical and", () => {
        const stmts = parse("true && false;");
        expect(stmts).toBeArrayOfSize(1);
        expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
        const exprStmt = stmts[0] as ExpressionStatement;
        expect(exprStmt.expression).toBeInstanceOf(LogicalExpression);
        const binaryExpr = exprStmt.expression as LogicalExpression;
        expect(binaryExpr.operator.type).toBe("LOGICAL_AND");
        expect((binaryExpr.left as LiteralExpression).value).toBe(true);
        expect((binaryExpr.right as LiteralExpression).value).toBe(false);
      });

      test("logical or", () => {
        const stmts = parse("true || false;");
        expect(stmts).toBeArrayOfSize(1);
        expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
        const exprStmt = stmts[0] as ExpressionStatement;
        expect(exprStmt.expression).toBeInstanceOf(LogicalExpression);
        const binaryExpr = exprStmt.expression as LogicalExpression;
        expect(binaryExpr.operator.type).toBe("LOGICAL_OR");
        expect((binaryExpr.left as LiteralExpression).value).toBe(true);
        expect((binaryExpr.right as LiteralExpression).value).toBe(false);
      });

      test("complex logical expression", () => {
        const stmts = parse("true && false || true;");
        expect(stmts).toBeArrayOfSize(1);
        expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
        const exprStmt = stmts[0] as ExpressionStatement;
        expect(exprStmt.expression).toBeInstanceOf(LogicalExpression);
        // Should be (true && false) || true due to precedence
        const topExpr = exprStmt.expression as LogicalExpression;
        expect(topExpr.operator.type).toBe("LOGICAL_OR");
        expect(topExpr.left).toBeInstanceOf(LogicalExpression);
        expect((topExpr.right as LiteralExpression).value).toBe(true);
      });
    });
  });
});
