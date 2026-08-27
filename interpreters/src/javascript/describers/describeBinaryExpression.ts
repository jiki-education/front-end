import type { EvaluationResultBinaryExpression } from "../evaluation-result";
import type { BinaryExpression } from "../expression";
import type { DescriptionContext } from "./types";
import { codeTag, formatJSObject } from "../helpers";
import { describeExpression } from "./describeSteps";

// The top-level sentence for a binary expression, with both operands replaced by
// the values they evaluated to (e.g. `6 < 6`). Shared with the for-loop describer,
// which folds this into a single step alongside the loop's update.
export function summariseBinaryExpression(
  expression: BinaryExpression,
  result: EvaluationResultBinaryExpression
): { expr: string; value: string } {
  return {
    expr: `${formatJSObject(result.left.immutableJikiObject)} ${expression.operator.lexeme} ${formatJSObject(
      result.right.immutableJikiObject
    )}`,
    value: formatJSObject(result.immutableJikiObject),
  };
}

export function describeBinaryExpression(
  expression: BinaryExpression,
  result: EvaluationResultBinaryExpression,
  context: DescriptionContext
) {
  const leftSteps = describeExpression(expression.left, result.left, context);
  const rightSteps = describeExpression(expression.right, result.right, context);

  const { expr, value } = summariseBinaryExpression(expression, result);

  const finalStep = context.t("description.binaryExpression.evaluated", {
    expr: codeTag(expr, expression.location),
    value: codeTag(value, expression.location),
  });
  return [...leftSteps, ...rightSteps, finalStep];
}
