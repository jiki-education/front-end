import type { Executor } from "../executor";
import type { LiteralExpression } from "../expression";
import type { EvaluationResultLiteralExpression } from "../evaluation-result";
import { createJSObject, JSNumber } from "../jikiObjects";
import { Fraction } from "../../shared/fraction";

export function executeLiteralExpression(
  executor: Executor,
  expression: LiteralExpression
): EvaluationResultLiteralExpression {
  // Numeric literals keep an exact rational value (e.g. 0.1 -> 1/10) so that
  // chained arithmetic stays order-independent.
  const jikiObject =
    typeof expression.value === "number"
      ? new JSNumber(expression.value, Fraction.fromNumber(expression.value))
      : createJSObject(expression.value);
  return {
    type: "LiteralExpression",
    jikiObject: jikiObject,
    immutableJikiObject: jikiObject.clone(),
  };
}
