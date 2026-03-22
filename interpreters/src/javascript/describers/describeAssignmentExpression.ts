import type { AssignmentExpression } from "../expression";
import { MemberExpression } from "../expression";
import type { EvaluationResultAssignmentExpression } from "../evaluation-result";
import type { DescriptionContext } from "../../shared/frames";
import { formatJSObject } from "../helpers";
import { describeExpression } from "./describeSteps";

export function describeAssignmentExpression(
  expression: AssignmentExpression,
  result: EvaluationResultAssignmentExpression,
  context: DescriptionContext
): string[] {
  const value = formatJSObject(result.immutableJikiObject);

  // Recursively describe the value expression's sub-steps
  const valueSteps = describeExpression(expression.value, result.value, context);

  // Handle member expression assignment
  if (expression.target instanceof MemberExpression) {
    return [
      ...valueSteps,
      `<li>Jiki set the array element at index ${result.name.slice(1, -1)} to <code>${value}</code>.</li>`,
    ];
  }

  // Handle regular identifier assignment
  const target = expression.target;
  return [...valueSteps, `<li>Jiki updated the variable <code>${target.lexeme}</code> to <code>${value}</code>.</li>`];
}
