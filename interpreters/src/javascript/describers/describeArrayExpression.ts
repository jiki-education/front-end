import type { ArrayExpression } from "../expression";
import type { EvaluationResultArrayExpression } from "../evaluation-result";

export function describeArrayExpression(expression: ArrayExpression, result: EvaluationResultArrayExpression): string {
  const jikiObject = result.immutableJikiObject;
  const count = expression.elements.length;

  if (count === 0) {
    return "Created an empty list";
  } else if (count === 1) {
    return `Created a list with 1 element: ${jikiObject.toString()}`;
  }
  return `Created a list with ${count} elements: ${jikiObject.toString()}`;
}
