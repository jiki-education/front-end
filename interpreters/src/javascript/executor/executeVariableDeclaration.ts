import type { Executor } from "../executor";
import type { VariableDeclaration } from "../statement";
import type { EvaluationResult } from "../evaluation-result";
import { CallExpression } from "../expression";
import { JSUndefined } from "../jikiObjects";

export function executeVariableDeclaration(executor: Executor, statement: VariableDeclaration): EvaluationResult {
  let value: EvaluationResult;
  let jikiObject;

  if (statement.initializer) {
    value = executor.evaluate(statement.initializer);
    jikiObject = value.jikiObject;
    // A variable should always hold an actual value. Storing `undefined` (a
    // forgotten return, an explicit `undefined`, `x && undefined`, ...) is
    // almost always a mistake, so we reject it here - matching JikiScript, which
    // has no undefined at all. The no-initializer branch below is left alone: it
    // is only reachable when requireVariableInstantiation is disabled, a feature
    // that exists precisely to allow uninitialised variables.
    //
    // The overwhelmingly common cause is calling a function (or method) that
    // doesn't return a value, so that case gets its own, more helpful message.
    if (jikiObject instanceof JSUndefined) {
      const errorType =
        statement.initializer instanceof CallExpression ? "AssignmentToUndefinedFromFunction" : "AssignmentToUndefined";
      executor.error(errorType, statement.initializer.location);
    }
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
