import { parse } from "@jikiscript/parser";
import { EvaluationContext, interpret } from "@jikiscript/interpreter";
import { FunctionCallStatement, FunctionStatement, LogStatement, ReturnStatement } from "@jikiscript/statement";
import { last } from "lodash";
import { unwrapJikiObject } from "@jikiscript/jikiObjects";
import type { TestAugmentedFrame } from "@shared/frames";
import { FunctionCallExpression, GetElementExpression, LiteralExpression } from "@jikiscript/expression";
import * as Jiki from "@jikiscript/jikiObjects";

describe("parse", () => {
  test("without arguments", () => {
    const stmts = parse("move()");
    expect(stmts).toBeArrayOfSize(1);
    expect(stmts[0]).toBeInstanceOf(FunctionCallStatement);
    const expStmt = stmts[0] as FunctionCallStatement;
    expect(expStmt.expression).toBeInstanceOf(FunctionCallExpression);
    const callExpr = expStmt.expression as FunctionCallExpression;
    expect(callExpr.args).toBeEmpty();
  });

  test("single argument", () => {
    const stmts = parse('turn("left")');
    expect(stmts).toBeArrayOfSize(1);
    expect(stmts[0]).toBeInstanceOf(FunctionCallStatement);
    const logStmt = stmts[0] as FunctionCallStatement;
    expect(logStmt.expression).toBeInstanceOf(FunctionCallExpression);
    const callExpr = logStmt.expression as FunctionCallExpression;
    expect(callExpr.args).toBeArrayOfSize(1);
    expect(callExpr.args[0]).toBeInstanceOf(LiteralExpression);
  });

  test("chained after", () => {
    const stmts = parse('log turn("left")[0]');
    expect(stmts).toBeArrayOfSize(1);
    expect(stmts[0]).toBeInstanceOf(LogStatement);

    const logStmt = stmts[0] as LogStatement;

    expect(logStmt.expression).toBeInstanceOf(GetElementExpression);
    const getStmt = logStmt.expression as GetElementExpression;

    expect(getStmt.obj).toBeInstanceOf(FunctionCallExpression);
    const callExpr = getStmt.obj as FunctionCallExpression;
    expect(callExpr.args).toBeArrayOfSize(1);
    expect(callExpr.args[0]).toBeInstanceOf(LiteralExpression);

    expect(getStmt.field).toBeInstanceOf(LiteralExpression);
    const fieldExpr = getStmt.field as LiteralExpression;
    expect(fieldExpr.value).toBe(0);
  });
});

describe("interpret", () => {
  describe("pass by value", () => {
    test("lists", () => {
      const { frames } = interpret(`
        set original to [1, 2, 3]
        function increment with list do
          change list[1] to list[1] + 1
          change list[2] to list[2] + 1
          change list[3] to list[3] + 1
        end
        increment(original)
        log original
      `);
      // Inside the function
      const finalFunctionFrame = frames[frames.length - 3];
      expect(unwrapJikiObject((finalFunctionFrame as TestAugmentedFrame).variables)["list"]).toEqual([2, 3, 4]);

      // After the function
      const lastFrame = frames[frames.length - 1];
      expect(unwrapJikiObject((lastFrame as TestAugmentedFrame).variables)["original"]).toEqual([1, 2, 3]);
    });
    test("dictionaries", () => {
      const { frames, error } = interpret(`
        set original to {"a": 1, "b": 2, "c": 3}
        function increment with dict do
          change dict["a"] to dict["a"] + 1
          change dict["b"] to dict["b"] + 1
          change dict["c"] to dict["c"] + 1
        end
        increment(original)
        log original
      `);
      // Inside the function
      const finalFunctionFrame = frames[frames.length - 3];
      expect(unwrapJikiObject((finalFunctionFrame as TestAugmentedFrame).variables)["dict"]).toMatchObject({
        a: 2,
        b: 3,
        c: 4,
      });

      // After the function
      const lastFrame = frames[frames.length - 1];
      expect(unwrapJikiObject((lastFrame as TestAugmentedFrame).variables)["original"]).toMatchObject({
        a: 1,
        b: 2,
        c: 3,
      });
    });
  });
  describe("pass by reference", () => {
    test.skip("custom type", () => {
      class MutableNumber extends Jiki.Instance {
        public methods: Map<string, Jiki.Method> = new Map();
        constructor(public number: number) {
          super(new Jiki.Class("Foo"));
          this.methods.set("increment", new Jiki.Method("increment", "", "public", 0, this.increment));
        }
        public getMethod(name: string): Jiki.Method | undefined {
          return this.methods.get(name);
        }
        public toArg(): MutableNumber {
          return this;
        }
        public toString() {
          return this.number.toString();
        }
        private increment() {
          this.number += 1;
          return new Jiki.Boolean(false); // return something concrete
        }
      }

      const context: EvaluationContext = {
        externalFunctions: [
          {
            name: "get_number",
            func: (_: any, i: Jiki.Number) => new MutableNumber(i.value),
            description: "",
          },
        ],
      };
      const { frames, error } = interpret(
        `
        function increment with number do
          number.increment()
        end
        set original to get_number(5)
        increment(original)
        log original`,
        context
      );

      // Last line
      const lastFrame = frames[frames.length - 1];
      expect(lastFrame.status).toBe("SUCCESS");
      expect(Jiki.unwrapJikiObject((lastFrame as TestAugmentedFrame).variables)["original"].value).toBe(6);
    });
  });
});
