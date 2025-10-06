import { parse } from "@jikiscript/parser";
import type { TestAugmentedFrame } from "@shared/frames";
import { EvaluationContext, interpret } from "@jikiscript/interpreter";
import {
  ChangeElementStatement,
  ChangePropertyStatement,
  LogStatement,
  MethodCallStatement,
} from "@jikiscript/statement";
import { last } from "lodash";
import * as Jiki from "@jikiscript/jikiObjects";
import {
  MethodCallExpression,
  LiteralExpression,
  GetElementExpression,
  VariableLookupExpression,
  AccessorExpression,
} from "@jikiscript/expression";
import { ExecutionContext } from "@jikiscript/executor";

describe("parse", () => {
  test("basic", () => {
    const stmts = parse("change foo.bar to true");
    expect(stmts).toBeArrayOfSize(1);
    expect(stmts[0]).toBeInstanceOf(ChangePropertyStatement);
    const changeStmt = stmts[0] as ChangePropertyStatement;
    expect(changeStmt.object).toBeInstanceOf(VariableLookupExpression);
    expect((changeStmt.object as VariableLookupExpression).name.lexeme).toBe("foo");
    expect(changeStmt.property.lexeme).toBe("bar");
  });

  test("chained before", () => {
    const stmts = parse("change foo[0].bar to true");
    expect(stmts).toBeArrayOfSize(1);
    expect(stmts[0]).toBeInstanceOf(ChangePropertyStatement);
    const changeStmt = stmts[0] as ChangePropertyStatement;
    expect(changeStmt.object).toBeInstanceOf(GetElementExpression);
    expect(changeStmt.property.lexeme).toBe("bar");
  });
});

test("execute", () => {
  const Person = new Jiki.Class("Person");
  Person.addConstructor(function (_: ExecutionContext, object: Jiki.Instance, name: Jiki.JikiObject) {
    object.setField("name", name);
  });
  Person.addGetter("name", "public");
  Person.addSetter("name", "public");

  const context: EvaluationContext = { classes: [Person] };
  const { frames, error } = interpret(
    `set person to new Person("Jeremy")
      change person.name to "Nicole"
      set name to person.name`,
    context
  );

  // Last line
  const lastFrame = frames[frames.length - 1];
  expect(Jiki.unwrapJikiObject((lastFrame as TestAugmentedFrame).variables)["name"]).toBe("Nicole");
});
