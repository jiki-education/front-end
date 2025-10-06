import { describe, expect, test } from "vitest";
import type { TestAugmentedFrame } from "@shared/frames";
import { parse } from "@javascript/parser";
import { interpret } from "@javascript/interpreter";
import type { UnaryExpression } from "@javascript/expression";
import type { ExpressionStatement } from "@javascript/statement";

describe("negation concept", () => {
  describe("arithmetic negation", () => {
    describe("parser", () => {
      test("parses negative number literals", () => {
        const stmts = parse("-5;");
        expect(stmts.length).toBe(1);
        const stmt = stmts[0] as ExpressionStatement;
        const expr = stmt.expression as UnaryExpression;
        expect(expr.type).toBe("UnaryExpression");
        expect(expr.operator.type).toBe("MINUS");
      });

      test("parses negative decimal literals", () => {
        const stmts = parse("-3.14;");
        expect(stmts.length).toBe(1);
        const stmt = stmts[0] as ExpressionStatement;
        const expr = stmt.expression as UnaryExpression;
        expect(expr.type).toBe("UnaryExpression");
        expect(expr.operator.type).toBe("MINUS");
      });

      test("parses negative variable", () => {
        const stmts = parse("let x = 5; -x;");
        expect(stmts.length).toBe(2);
        const negationStmt = stmts[1] as ExpressionStatement;
        const expr = negationStmt.expression as UnaryExpression;
        expect(expr.type).toBe("UnaryExpression");
        expect(expr.operator.type).toBe("MINUS");
      });

      test("parses nested negation", () => {
        const stmts = parse("-(-5);");
        expect(stmts.length).toBe(1);
        const stmt = stmts[0] as ExpressionStatement;
        const expr = stmt.expression as UnaryExpression;
        expect(expr.type).toBe("UnaryExpression");
        expect(expr.operator.type).toBe("MINUS");
        // The operand should be a GroupingExpression containing the inner negation
        expect(expr.operand.type).toBe("GroupingExpression");
        const grouping = expr.operand as any;
        const innerExpr = grouping.inner as UnaryExpression;
        expect(innerExpr.type).toBe("UnaryExpression");
        expect(innerExpr.operator.type).toBe("MINUS");
      });
    });

    describe("executor", () => {
      test("negates positive numbers", () => {
        const { frames, error } = interpret("-5;");
        expect(error).toBeNull();
        expect(frames.length).toBe(1);
        expect(frames[0].result?.jikiObject.value).toBe(-5);
      });

      test("negates negative numbers", () => {
        const { frames, error } = interpret("-(-5);");
        expect(error).toBeNull();
        expect(frames.length).toBe(1);
        expect(frames[0].result?.jikiObject.value).toBe(5);
      });

      test("negates decimal numbers", () => {
        const { frames, error } = interpret("-3.14;");
        expect(error).toBeNull();
        expect(frames.length).toBe(1);
        expect(frames[0].result?.jikiObject.value).toBeCloseTo(-3.14);
      });

      test("negates variables", () => {
        const { frames, error } = interpret("let x = 10; -x;");
        expect(error).toBeNull();
        expect(frames.length).toBe(2);
        expect(frames[1].result?.jikiObject.value).toBe(-10);
      });

      test("negates expressions", () => {
        const { frames, error } = interpret("-(5 + 3);");
        expect(error).toBeNull();
        expect(frames.length).toBe(1);
        expect(frames[0].result?.jikiObject.value).toBe(-8);
      });
    });
  });

  describe("logical negation", () => {
    describe("parser", () => {
      test("parses NOT with true", () => {
        const stmts = parse("!true;");
        expect(stmts.length).toBe(1);
        const stmt = stmts[0] as ExpressionStatement;
        const expr = stmt.expression as UnaryExpression;
        expect(expr.type).toBe("UnaryExpression");
        expect(expr.operator.type).toBe("NOT");
      });

      test("parses NOT with false", () => {
        const stmts = parse("!false;");
        expect(stmts.length).toBe(1);
        const stmt = stmts[0] as ExpressionStatement;
        const expr = stmt.expression as UnaryExpression;
        expect(expr.type).toBe("UnaryExpression");
        expect(expr.operator.type).toBe("NOT");
      });

      test("parses NOT with variable", () => {
        const stmts = parse("let flag = true; !flag;");
        expect(stmts.length).toBe(2);
        const notStmt = stmts[1] as ExpressionStatement;
        const expr = notStmt.expression as UnaryExpression;
        expect(expr.type).toBe("UnaryExpression");
        expect(expr.operator.type).toBe("NOT");
      });

      test("parses double negation", () => {
        const stmts = parse("!!true;");
        expect(stmts.length).toBe(1);
        const stmt = stmts[0] as ExpressionStatement;
        const expr = stmt.expression as UnaryExpression;
        expect(expr.type).toBe("UnaryExpression");
        expect(expr.operator.type).toBe("NOT");
        const innerExpr = expr.operand as UnaryExpression;
        expect(innerExpr.type).toBe("UnaryExpression");
        expect(innerExpr.operator.type).toBe("NOT");
      });
    });

    describe("executor", () => {
      test("negates true to false", () => {
        const { frames, error } = interpret("!true;");
        expect(error).toBeNull();
        expect(frames.length).toBe(1);
        expect(frames[0].result?.jikiObject.value).toBe(false);
      });

      test("negates false to true", () => {
        const { frames, error } = interpret("!false;");
        expect(error).toBeNull();
        expect(frames.length).toBe(1);
        expect(frames[0].result?.jikiObject.value).toBe(true);
      });

      test("double negation returns original value", () => {
        const { frames, error } = interpret("!!true;");
        expect(error).toBeNull();
        expect(frames.length).toBe(1);
        expect(frames[0].result?.jikiObject.value).toBe(true);
      });

      test("negates boolean variables", () => {
        const { frames, error } = interpret("let flag = false; !flag;");
        expect(error).toBeNull();
        expect(frames.length).toBe(2);
        expect(frames[1].result?.jikiObject.value).toBe(true);
      });

      // Comparison operators not yet implemented - skipping this test
      // test("negates boolean expressions", () => {
      //   const { frames, error } = interpret("!(5 > 3);");
      //   expect(error).toBeNull();
      //   expect(frames.length).toBe(1);
      //   expect(frames[0].result?.jikiObject.value).toBe(false);
      // });

      test("negates complex boolean expressions", () => {
        const { frames, error } = interpret("!(true && false);");
        expect(error).toBeNull();
        expect(frames.length).toBe(1);
        expect(frames[0].result?.jikiObject.value).toBe(true);
      });
    });
  });

  describe("mixed negation operations", () => {
    test("arithmetic and logical negation in same expression", () => {
      const { frames, error } = interpret("let x = -5; let y = !false; x + y;", {
        languageFeatures: { allowTypeCoercion: true },
      });
      expect(error).toBeNull();
      expect(frames.length).toBe(3);
      expect(frames[0].result?.jikiObject.value).toBe(-5);
      expect(frames[1].result?.jikiObject.value).toBe(true);
      expect(frames[2].result?.jikiObject.value).toBe(-4); // -5 + 1 (true coerced to 1)
    });

    test("nested mixed negations", () => {
      const { frames, error } = interpret("-(!false);", { languageFeatures: { allowTypeCoercion: true } });
      expect(error).toBeNull();
      expect(frames.length).toBe(1);
      expect(frames[0].result?.jikiObject.value).toBe(-1); // -(true) = -1
    });
  });

  describe("operator precedence", () => {
    test("negation has higher precedence than multiplication", () => {
      const { frames, error } = interpret("-5 * 2;");
      expect(error).toBeNull();
      expect(frames.length).toBe(1);
      expect(frames[0].result?.jikiObject.value).toBe(-10); // (-5) * 2
    });

    test("negation has higher precedence than addition", () => {
      const { frames, error } = interpret("-5 + 3;");
      expect(error).toBeNull();
      expect(frames.length).toBe(1);
      expect(frames[0].result?.jikiObject.value).toBe(-2); // (-5) + 3
    });

    test("NOT has higher precedence than logical AND", () => {
      const { frames, error } = interpret("!false && true;");
      expect(error).toBeNull();
      expect(frames.length).toBe(1);
      expect(frames[0].result?.jikiObject.value).toBe(true); // (!false) && true
    });

    test("NOT has higher precedence than logical OR", () => {
      const { frames, error } = interpret("!false || false;");
      expect(error).toBeNull();
      expect(frames.length).toBe(1);
      expect(frames[0].result?.jikiObject.value).toBe(true); // (!false) || false
    });
  });

  describe("educational descriptions", () => {
    test("arithmetic negation has description", () => {
      const { frames } = interpret("-5;");
      expect((frames[0] as TestAugmentedFrame).description).toBeDefined();
    });

    test("logical negation has description", () => {
      const { frames } = interpret("!true;");
      expect((frames[0] as TestAugmentedFrame).description).toBeDefined();
      expect((frames[0] as TestAugmentedFrame).description).toContain("!");
    });

    test("negation of expression shows steps", () => {
      const { frames } = interpret("!(true && false);");
      expect((frames[0] as TestAugmentedFrame).description).toBeDefined();
      expect((frames[0] as TestAugmentedFrame).description).toContain("!");
    });
  });
});
