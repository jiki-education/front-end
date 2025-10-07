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
      type: "LiteralExpression",
      jikiObject: jikiObject,
      immutableJikiObject: jikiObject.clone(),
    };
  }

  // Shadowing check is now handled inside environment.define()
  const isConst = statement.kind === "const";
  executor.environment.define(statement.name.lexeme, jikiObject, statement.name.location, isConst);
  return {
    type: "VariableDeclaration",
    kind: statement.kind,
    name: statement.name.lexeme,
    value: value,
    jikiObject: jikiObject,
    immutableJikiObject: jikiObject.clone(),
  };
}
