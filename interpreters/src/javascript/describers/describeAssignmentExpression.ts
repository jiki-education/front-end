import type { AssignmentExpression } from "../expression";
import { MemberExpression } from "../expression";
import type { EvaluationResultAssignmentExpression } from "../evaluation-result";
import type { DescriptionContext } from "./types";
import { codeTag, formatJSObject } from "../helpers";
import { describeExpression } from "./describeSteps";

export function describeAssignmentExpression(
  expression: AssignmentExpression,
  result: EvaluationResultAssignmentExpression,
  context: DescriptionContext
): string[] {
  const value = codeTag(formatJSObject(result.immutableJikiObject), expression.location);

  // Recursively describe the value expression's sub-steps
  const valueSteps = describeExpression(expression.value, result.value, context);

  // Array element assignment: find the array and put the new value in the slot.
  if (expression.target instanceof MemberExpression) {
    return [
      ...valueSteps,
      context.t("description.assignmentExpression.element_put", {
        index: result.name.slice(1, -1),
        value,
      }),
    ];
  }

  // Regular variable assignment: find the box and put the new value in it.
  const target = expression.target;
  const name = codeTag(target.lexeme, target.location);
  return [
    ...valueSteps,
    context.t("description.assignmentExpression.variable_found", { name }),
    context.t("description.assignmentExpression.variable_put", { value }),
  ];
}
