import type { EvaluationResultBinaryExpression } from "../evaluation-result";
import type { BinaryExpression } from "../expression";
import type { DescriptionContext } from "./types";
import { codeTag, formatJSObject } from "../helpers";
import { describeExpression } from "./describeSteps";

export function describeBinaryExpression(
  expression: BinaryExpression,
  result: EvaluationResultBinaryExpression,
  context: DescriptionContext
) {
  const leftSteps = describeExpression(expression.left, result.left, context);
  const rightSteps = describeExpression(expression.right, result.right, context);

  const leftRes = formatJSObject(result.left.immutableJikiObject);
  const op = expression.operator.lexeme;
  const rightRes = formatJSObject(result.right.immutableJikiObject);

  const finalStep = context.t("description.binaryExpression.evaluated", {
    expr: codeTag(`${leftRes} ${op} ${rightRes}`, expression.location),
    value: codeTag(result.immutableJikiObject, expression.location),
  });
  return [...leftSteps, ...rightSteps, finalStep];
}
