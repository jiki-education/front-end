import type { Executor } from "../executor";
import type { LiteralExpression } from "../expression";
import type { EvaluationResult } from "../evaluation-result";
import { createJSObject } from "../jikiObjects";

export function executeLiteralExpression(executor: Executor, expression: LiteralExpression): EvaluationResult {
  const jikiObject = createJSObject(expression.value);
  return {
    type: "LiteralExpression",
    jikiObject: jikiObject,
    immutableJikiObject: jikiObject.clone(),
  };
}
