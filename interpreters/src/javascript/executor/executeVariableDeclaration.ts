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

  // Silently ignore redeclarations of a secret constant at the top level.
  // (Inner-scope shadows are allowed and fall through to the normal path.)
  const name = statement.name.lexeme;
  if (executor.secretConstantNames.has(name) && executor.environment === executor.globalEnvironment) {
    const existing = executor.environment.get(name)!;
    return {
      type: "VariableDeclaration",
      kind: statement.kind,
      name,
      value,
      jikiObject: existing,
      immutableJikiObject: existing.clone(),
    };
  }

  // Shadowing and same-scope redeclaration checks are handled inside environment.define()
  const isConst = statement.kind === "const";
  executor.environment.define(name, jikiObject, statement.name.location, isConst, /* isDeclaration */ true);
  return {
    type: "VariableDeclaration",
    kind: statement.kind,
    name,
    value: value,
    jikiObject: jikiObject,
    immutableJikiObject: jikiObject.clone(),
  };
}
