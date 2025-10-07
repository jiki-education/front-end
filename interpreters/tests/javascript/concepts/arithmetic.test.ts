import { parse } from "@javascript/parser";
import { ExpressionStatement } from "@javascript/statement";
import { LiteralExpression, BinaryExpression, UnaryExpression, GroupingExpression } from "@javascript/expression";

describe("arithmetic", () => {
  describe("parse", () => {
    describe("literals", () => {
      test("integer", () => {
        const stmts = parse("1;");
        expect(stmts).toBeArrayOfSize(1);
        expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
        const exprStmt = stmts[0] as ExpressionStatement;
        expect(exprStmt.expression).toBeInstanceOf(LiteralExpression);
        expect((exprStmt.expression as LiteralExpression).value).toBe(1);
      });

      test("floating point", () => {
        const stmts = parse("1.5;");
        expect(stmts).toBeArrayOfSize(1);
        expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
        const exprStmt = stmts[0] as ExpressionStatement;
        expect(exprStmt.expression).toBeInstanceOf(LiteralExpression);
        expect((exprStmt.expression as LiteralExpression).value).toBe(1.5);
      });

      test("negative integer", () => {
        const stmts = parse("-5;");
        expect(stmts).toBeArrayOfSize(1);
        expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
        const exprStmt = stmts[0] as ExpressionStatement;
        expect(exprStmt.expression).toBeInstanceOf(UnaryExpression);
        const unaryExpr = exprStmt.expression as UnaryExpression;
        expect(unaryExpr.operator.lexeme).toBe("-");
        expect((unaryExpr.operand as LiteralExpression).value).toBe(5);
      });

      test("negative floating point", () => {
        const stmts = parse("-1.5;");
        expect(stmts).toBeArrayOfSize(1);
        expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
        const exprStmt = stmts[0] as ExpressionStatement;
        expect(exprStmt.expression).toBeInstanceOf(UnaryExpression);
        const unaryExpr = exprStmt.expression as UnaryExpression;
        expect(unaryExpr.operator.lexeme).toBe("-");
        expect((unaryExpr.operand as LiteralExpression).value).toBe(1.5);
      });
    });

    describe("binary operations", () => {
      test("addition", () => {
        const stmts = parse("1 + 2;");
        expect(stmts).toBeArrayOfSize(1);
        expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
        const exprStmt = stmts[0] as ExpressionStatement;
        expect(exprStmt.expression).toBeInstanceOf(BinaryExpression);
        const binaryExpr = exprStmt.expression as BinaryExpression;
        expect(binaryExpr.operator.type).toBe("PLUS");
        expect((binaryExpr.left as LiteralExpression).value).toBe(1);
        expect((binaryExpr.right as LiteralExpression).value).toBe(2);
      });

      test("subtraction", () => {
        const stmts = parse("1 - 2;");
        expect(stmts).toBeArrayOfSize(1);
        expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
        const exprStmt = stmts[0] as ExpressionStatement;
        expect(exprStmt.expression).toBeInstanceOf(BinaryExpression);
        const binaryExpr = exprStmt.expression as BinaryExpression;
        expect(binaryExpr.operator.type).toBe("MINUS");
        expect((binaryExpr.left as LiteralExpression).value).toBe(1);
        expect((binaryExpr.right as LiteralExpression).value).toBe(2);
      });

      test("multiplication", () => {
        const stmts = parse("1 * 2;");
        expect(stmts).toBeArrayOfSize(1);
        expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
        const exprStmt = stmts[0] as ExpressionStatement;
        expect(exprStmt.expression).toBeInstanceOf(BinaryExpression);
        const binaryExpr = exprStmt.expression as BinaryExpression;
        expect(binaryExpr.operator.type).toBe("STAR");
        expect((binaryExpr.left as LiteralExpression).value).toBe(1);
        expect((binaryExpr.right as LiteralExpression).value).toBe(2);
      });

      test("division", () => {
        const stmts = parse("1 / 2;");
        expect(stmts).toBeArrayOfSize(1);
        expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
        const exprStmt = stmts[0] as ExpressionStatement;
        expect(exprStmt.expression).toBeInstanceOf(BinaryExpression);
        const binaryExpr = exprStmt.expression as BinaryExpression;
        expect(binaryExpr.operator.type).toBe("SLASH");
        expect((binaryExpr.left as LiteralExpression).value).toBe(1);
        expect((binaryExpr.right as LiteralExpression).value).toBe(2);
      });

      test("exponentiation", () => {
        const stmts = parse("2 ** 3;");
        expect(stmts).toBeArrayOfSize(1);
        expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
        const exprStmt = stmts[0] as ExpressionStatement;
        expect(exprStmt.expression).toBeInstanceOf(BinaryExpression);
        const binaryExpr = exprStmt.expression as BinaryExpression;
        expect(binaryExpr.operator.type).toBe("STAR_STAR");
        expect((binaryExpr.left as LiteralExpression).value).toBe(2);
        expect((binaryExpr.right as LiteralExpression).value).toBe(3);
      });

      test("exponentiation is right-associative", () => {
        // 2 ** 3 ** 2 should parse as 2 ** (3 ** 2), not (2 ** 3) ** 2
        const stmts = parse("2 ** 3 ** 2;");
        expect(stmts).toBeArrayOfSize(1);
        const exprStmt = stmts[0] as ExpressionStatement;
        expect(exprStmt.expression).toBeInstanceOf(BinaryExpression);
        const topExpr = exprStmt.expression as BinaryExpression;
        expect(topExpr.operator.type).toBe("STAR_STAR");
        expect((topExpr.left as LiteralExpression).value).toBe(2);
        expect(topExpr.right).toBeInstanceOf(BinaryExpression);
        const rightExpr = topExpr.right as BinaryExpression;
        expect(rightExpr.operator.type).toBe("STAR_STAR");
        expect((rightExpr.left as LiteralExpression).value).toBe(3);
        expect((rightExpr.right as LiteralExpression).value).toBe(2);
      });

      test("exponentiation has higher precedence than multiplication", () => {
        // 2 * 3 ** 2 should parse as 2 * (3 ** 2), not (2 * 3) ** 2
        const stmts = parse("2 * 3 ** 2;");
        expect(stmts).toBeArrayOfSize(1);
        const exprStmt = stmts[0] as ExpressionStatement;
        expect(exprStmt.expression).toBeInstanceOf(BinaryExpression);
        const topExpr = exprStmt.expression as BinaryExpression;
        expect(topExpr.operator.type).toBe("STAR");
        expect((topExpr.left as LiteralExpression).value).toBe(2);
        expect(topExpr.right).toBeInstanceOf(BinaryExpression);
        const rightExpr = topExpr.right as BinaryExpression;
        expect(rightExpr.operator.type).toBe("STAR_STAR");
        expect((rightExpr.left as LiteralExpression).value).toBe(3);
        expect((rightExpr.right as LiteralExpression).value).toBe(2);
      });

      test("complex expression", () => {
        const stmts = parse("1 + 2 * 3 / 4 - 5;");
        expect(stmts).toBeArrayOfSize(1);
        expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
        const exprStmt = stmts[0] as ExpressionStatement;
        expect(exprStmt.expression).toBeInstanceOf(BinaryExpression);
        // Test operator precedence: should be (1 + ((2 * 3) / 4)) - 5
        const topExpr = exprStmt.expression as BinaryExpression;
        expect(topExpr.operator.type).toBe("MINUS");
        expect((topExpr.right as LiteralExpression).value).toBe(5);
      });
    });

    describe("grouping", () => {
      test("parentheses", () => {
        const stmts = parse("(1 + 2) * 3;");
        expect(stmts).toBeArrayOfSize(1);
        expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
        const exprStmt = stmts[0] as ExpressionStatement;
        expect(exprStmt.expression).toBeInstanceOf(BinaryExpression);
        const binaryExpr = exprStmt.expression as BinaryExpression;
        expect(binaryExpr.operator.type).toBe("STAR");
        expect(binaryExpr.left).toBeInstanceOf(GroupingExpression);
        expect((binaryExpr.right as LiteralExpression).value).toBe(3);
      });

      test("nested parentheses", () => {
        const stmts = parse("1 + (2 * (3 + 4));");
        expect(stmts).toBeArrayOfSize(1);
        expect(stmts[0]).toBeInstanceOf(ExpressionStatement);
        const exprStmt = stmts[0] as ExpressionStatement;
        expect(exprStmt.expression).toBeInstanceOf(BinaryExpression);
        const binaryExpr = exprStmt.expression as BinaryExpression;
        expect(binaryExpr.operator.type).toBe("PLUS");
        expect((binaryExpr.left as LiteralExpression).value).toBe(1);
        expect(binaryExpr.right).toBeInstanceOf(GroupingExpression);
      });
    });
  });
});
