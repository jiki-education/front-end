import type { Executor } from "../executor";
import type { VariableDeclaration } from "../statement";
import type { EvaluationResult } from "../evaluation-result";
import { JSUndefined } from "../jikiObjects";

export function executeVariableDeclaration(executor: Executor, statement: VariableDeclaration): EvaluationResult {
  let value: EvaluationResult;
  let jikiObject;

  if (statement.initializer) {
    value = executor.evaluate(statement.initializer);
    jikiObject = value.jikiObject;
  } else {
    // No initializer - variable is undefined
    jikiObject = new JSUndefined();
    value = {
      type: "Literal",
      value: undefined,
      jikiObject: jikiObject,
      immutableJikiObject: jikiObject.clone(),
    } as any;
  }

  // Shadowing check is now handled inside environment.define()
  executor.environment.define(statement.name.lexeme, jikiObject, statement.name.location);
  return {
    type: "VariableDeclaration",
    name: statement.name.lexeme,
    value: value,
    jikiObject: jikiObject,
    immutableJikiObject: jikiObject.clone(),
  } as any;
}
