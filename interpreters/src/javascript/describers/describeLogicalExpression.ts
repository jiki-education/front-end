import type { EvaluationResultLogicalExpression } from "../evaluation-result";
import type { LogicalExpression } from "../expression";
import type { DescriptionContext } from "./types";
import { codeTag, formatJSObject } from "../helpers";
import { describeExpression } from "./describeSteps";

export function describeLogicalExpression(
  expression: LogicalExpression,
  result: EvaluationResultLogicalExpression,
  context: DescriptionContext
) {
  if (result.shortCircuited) {
    return describeShortCircuitedExpression(expression, result, context);
  }

  const leftSteps = describeExpression(expression.left, result.left, context);
  const rightSteps = describeExpression(expression.right, result.right, context);

  const leftRes = formatJSObject(result.left.immutableJikiObject);
  const op = expression.operator.lexeme;
  const rightRes = formatJSObject(result.right.immutableJikiObject);

  const finalStep = context.t("description.logicalExpression.evaluated", {
    expr: codeTag(`${leftRes} ${op} ${rightRes}`, expression.location),
    value: codeTag(result.immutableJikiObject, expression.location),
  });
  return [...leftSteps, ...rightSteps, finalStep];
}

function describeShortCircuitedExpression(
  expression: LogicalExpression,
  result: EvaluationResultLogicalExpression,
  context: DescriptionContext
) {
  const leftSteps = describeExpression(expression.left, result.left, context);
  const leftRes = formatJSObject(result.left.immutableJikiObject);

  return [
    ...leftSteps,
    context.t("description.logicalExpression.shortCircuited", {
      operator: codeTag(expression.operator.lexeme, expression.operator.location),
      value: codeTag(leftRes, expression.left.location),
    }),
  ];
}
