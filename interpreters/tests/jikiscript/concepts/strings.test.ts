import { interpret } from "@jikiscript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";
import { parse } from "@jikiscript/parser";
import * as Jiki from "@jikiscript/jikiObjects";
import { ChangeElementStatement, LogStatement, SetVariableStatement } from "@jikiscript/statement";
import {
  BinaryExpression,
  FunctionCallExpression,
  GetElementExpression,
  ListExpression,
  LiteralExpression,
  UnaryExpression,
  VariableLookupExpression,
} from "@jikiscript/expression";

describe("strings", () => {
  describe("parse", () => {
    test("literal", () => {
      const stmts = parse('log "nice"');
      expect(stmts).toBeArrayOfSize(1);
      expect(stmts[0]).toBeInstanceOf(LogStatement);
      const logStmt = stmts[0] as LogStatement;
      expect(logStmt.expression).toBeInstanceOf(LiteralExpression);
      const literalExpr = logStmt.expression as LiteralExpression;
      expect(literalExpr.value).toBe("nice");
    });
    describe("index access", () => {
      test("literal", () => {
        const stmts = parse(`log "foobar"[4] `);
        expect(stmts).toBeArrayOfSize(1);
        expect(stmts[0]).toBeInstanceOf(LogStatement);
        const logStmt = stmts[0] as LogStatement;
        expect(logStmt.expression).toBeInstanceOf(GetElementExpression);
        const getExpr = logStmt.expression as GetElementExpression;
        expect(getExpr.obj).toBeInstanceOf(LiteralExpression);
        expect(getExpr.field).toBeInstanceOf(LiteralExpression);

        expect((getExpr.obj as LiteralExpression).value).toBe("foobar");
        expect((getExpr.field as LiteralExpression).value).toBe(4);
      });
      test("expression", () => {
        const stmts = parse(`log "foobar"[4 + 1] `);
        expect(stmts).toBeArrayOfSize(1);
        expect(stmts[0]).toBeInstanceOf(LogStatement);
        const logStmt = stmts[0] as LogStatement;
        expect(logStmt.expression).toBeInstanceOf(GetElementExpression);
        const getExpr = logStmt.expression as GetElementExpression;
        expect(getExpr.obj).toBeInstanceOf(LiteralExpression);
        expect(getExpr.field).toBeInstanceOf(BinaryExpression);

        expect((getExpr.obj as LiteralExpression).value).toBe("foobar");

        const fieldExpr = getExpr.field as BinaryExpression;
        expect(fieldExpr.operator.lexeme).toBe("+");
        expect(fieldExpr.left).toBeInstanceOf(LiteralExpression);
        expect(fieldExpr.right).toBeInstanceOf(LiteralExpression);
        expect((fieldExpr.left as LiteralExpression).value).toBe(4);
        expect((fieldExpr.right as LiteralExpression).value).toBe(1);
      });
    });
  });

  describe("execute", () => {
    test("set", () => {
      const { frames } = interpret('set x to "hello there"');
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect((frames[0] as TestAugmentedFrame).variables["x"].value).toBe("hello there");
    });

    test("log", () => {
      const { frames } = interpret(`log "foobar"`);
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(Jiki.unwrapJikiObject(frames[0].result?.jikiObject)).toBe("foobar");
    });

    test("iterate", () => {
      const { frames } = interpret(`
        for each char in "ab" do
          log char
        end
      `);
      expect(frames).toBeArrayOfSize(4);
      expect(frames[2].status).toBe("SUCCESS");
      expect(Jiki.unwrapJikiObject(frames[1].result?.jikiObject)).toBe("a");
      expect(Jiki.unwrapJikiObject(frames[3].result?.jikiObject)).toBe("b");
    });

    describe("index access", () => {
      test("single", () => {
        const { frames } = interpret(`log "foobar"[4] `);
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect(Jiki.unwrapJikiObject(frames[0].result?.jikiObject)).toBe("b");
      });
      test("expression", () => {
        const { frames } = interpret(`log "foobar"[4 + 1] `);
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect(Jiki.unwrapJikiObject(frames[0].result?.jikiObject)).toBe("a");
      });
    });
  });
});
