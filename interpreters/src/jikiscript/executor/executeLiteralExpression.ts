import type { Executor } from "../executor";
import type { LiteralExpression } from "../expression";
import type { EvaluationResultLiteralExpression } from "../evaluation-result";
import { isBoolean, isNumber, isString } from "../checks";
import * as Jiki from "../jikiObjects";

export function executeLiteralExpression(
  executor: Executor,
  expression: LiteralExpression
): EvaluationResultLiteralExpression {
  let jikiObject;
  if (isBoolean(expression.value)) {
    jikiObject = new Jiki.Boolean(expression.value);
  } else if (isNumber(expression.value)) {
    jikiObject = new Jiki.Number(expression.value);
  } else if (isString(expression.value)) {
    jikiObject = new Jiki.String(expression.value);
  } else {
    // If this happens, we've gone really wrong somewhere!
    executor.error("InvalidLiteralTypeInExpression", expression.location, {
      value: expression.value,
    });
  }
  return {
    type: "LiteralExpression",
    jikiObject: jikiObject,
    immutableJikiObject: jikiObject.clone(),
  };
}
