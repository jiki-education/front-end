import type { ArrayExpression } from "../expression";
import type { EvaluationResultArrayExpression } from "../evaluation-result";
import type { DescriptionContext } from "./types";

export function describeArrayExpression(
  expression: ArrayExpression,
  result: EvaluationResultArrayExpression,
  context: DescriptionContext
): string {
  const jikiObject = result.immutableJikiObject;
  const count = expression.elements.length;

  if (count === 0) {
    return context.t("description.arrayExpression.empty");
  }
  return context.t("description.arrayExpression.created", {
    count,
    value: jikiObject.toDisplayString(),
  });
}
