import type { Executor } from "../executor";
import type { LiteralExpression } from "../expression";
import type { EvaluationResult } from "../evaluation-result";
import { createPyObject } from "../jikiObjects";

export function executeLiteralExpression(executor: Executor, expression: LiteralExpression): EvaluationResult {
  const jikiObject = createPyObject(expression.value);
  return {
    type: "LiteralExpression",
    jikiObject: jikiObject,
    immutableJikiObject: jikiObject.clone(),
  };
}
