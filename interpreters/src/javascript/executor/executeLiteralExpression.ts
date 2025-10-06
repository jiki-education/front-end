import type { Executor } from "../executor";
import type { LiteralExpression } from "../expression";
import type { EvaluationResultLiteralExpression } from "../evaluation-result";
import { createJSObject } from "../jikiObjects";

export function executeLiteralExpression(
  executor: Executor,
  expression: LiteralExpression
): EvaluationResultLiteralExpression {
  const jikiObject = createJSObject(expression.value);
  return {
    type: "LiteralExpression",
    jikiObject: jikiObject,
    immutableJikiObject: jikiObject.clone(),
  };
}
