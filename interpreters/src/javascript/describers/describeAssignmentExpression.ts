import type { AssignmentExpression } from "../expression";
import { MemberExpression } from "../expression";
import type { EvaluationResultAssignmentExpression } from "../evaluation-result";
import { formatJSObject } from "../helpers";

export function describeAssignmentExpression(
  expression: AssignmentExpression,
  result: EvaluationResultAssignmentExpression
): string {
  const value = formatJSObject(result.immutableJikiObject);

  // Handle member expression assignment
  if (expression.target instanceof MemberExpression) {
    // For now, just describe it simply
    // TODO: Could be enhanced to show the full chain
    return `<li>JavaScript set the array element at index ${result.name.slice(1, -1)} to <code>${value}</code>.</li>`;
  }

  // Handle regular identifier assignment
  const target = expression.target;
  return `<li>JavaScript updated the variable <code>${target.lexeme}</code> to <code>${value}</code>.</li>`;
}
