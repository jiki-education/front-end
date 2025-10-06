import { parse } from "@javascript/parser";
import { ExpressionStatement } from "@javascript/statement";
import { LiteralExpression, BinaryExpression, UnaryExpression, GroupingExpression } from "@javascript/expression";

describe("comprehensive", () => {
  describe("parse", () => {
    describe("mixed expressions", () => {
      test("arithmetic with booleans grouping", () => {
        const stmts = parse("(1 + 2) && (true || false);");
        expect(stmts).toBeArrayOfSize(1);
        expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
        const exprStmt = stmts[0] as ExpressionStatement;
        expect(exprStmt.expression).toBeInstanceOf(BinaryExpression);
        const binaryExpr = exprStmt.expression as BinaryExpression;
        expect(binaryExpr.operator.type).toBe("LOGICAL_AND");
        expect(binaryExpr.left).toBeInstanceOf(GroupingExpression);
        expect(binaryExpr.right).toBeInstanceOf(GroupingExpression);
      });

      test("complex operator precedence", () => {
        const stmts = parse("1 + 2 * 3 && true || false;");
        expect(stmts).toBeArrayOfSize(1);
        expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
        const exprStmt = stmts[0] as ExpressionStatement;
        expect(exprStmt.expression).toBeInstanceOf(BinaryExpression);
        // Should be ((1 + (2 * 3)) && true) || false
        const topExpr = exprStmt.expression as BinaryExpression;
        expect(topExpr.operator.type).toBe("LOGICAL_OR");
        expect((topExpr.right as LiteralExpression).value).toBe(false);
        expect(topExpr.left).toBeInstanceOf(BinaryExpression);
      });

      test("string concatenation with grouping", () => {
        const stmts = parse('("hello" + " ") + "world";');
        expect(stmts).toBeArrayOfSize(1);
        expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
        const exprStmt = stmts[0] as ExpressionStatement;
        expect(exprStmt.expression).toBeInstanceOf(BinaryExpression);
        const binaryExpr = exprStmt.expression as BinaryExpression;
        expect(binaryExpr.operator.type).toBe("PLUS");
        expect(binaryExpr.left).toBeInstanceOf(GroupingExpression);
        expect((binaryExpr.right as LiteralExpression).value).toBe("world");
      });

      test("nested grouping with mixed types", () => {
        const stmts = parse("((1 + 2) * 3) && (true || (false && true));");
        expect(stmts).toBeArrayOfSize(1);
        expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
        const exprStmt = stmts[0] as ExpressionStatement;
        expect(exprStmt.expression).toBeInstanceOf(BinaryExpression);
        const topExpr = exprStmt.expression as BinaryExpression;
        expect(topExpr.operator.type).toBe("LOGICAL_AND");
        expect(topExpr.left).toBeInstanceOf(GroupingExpression);
        expect(topExpr.right).toBeInstanceOf(GroupingExpression);

        // Check the right side has nested grouping
        const rightGroup = topExpr.right as GroupingExpression;
        expect(rightGroup.inner).toBeInstanceOf(BinaryExpression);
        const rightInner = rightGroup.inner as BinaryExpression;
        expect(rightInner.operator.type).toBe("LOGICAL_OR");
        expect(rightInner.right).toBeInstanceOf(GroupingExpression);
      });
    });

    describe("edge cases", () => {
      test("unary minus with grouping", () => {
        const stmts = parse("-(1 + 2);");
        expect(stmts).toBeArrayOfSize(1);
        expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
        const exprStmt = stmts[0] as ExpressionStatement;
        expect(exprStmt.expression).toBeInstanceOf(UnaryExpression);
        const unaryExpr = exprStmt.expression as UnaryExpression;
        expect(unaryExpr.operator.lexeme).toBe("-");
        expect(unaryExpr.operand).toBeInstanceOf(GroupingExpression);
      });

      test("multiple levels of grouping", () => {
        const stmts = parse("(((1)));");
        expect(stmts).toBeArrayOfSize(1);
        expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
        const exprStmt = stmts[0] as ExpressionStatement;
        expect(exprStmt.expression).toBeInstanceOf(GroupingExpression);
        const group1 = exprStmt.expression as GroupingExpression;
        expect(group1.inner).toBeInstanceOf(GroupingExpression);
        const group2 = group1.inner as GroupingExpression;
        expect(group2.inner).toBeInstanceOf(GroupingExpression);
        const group3 = group2.inner as GroupingExpression;
        expect(group3.inner).toBeInstanceOf(LiteralExpression);
        expect((group3.inner as LiteralExpression).value).toBe(1);
      });
    });
  });
});
