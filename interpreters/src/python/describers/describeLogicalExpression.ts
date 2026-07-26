import type { Expression, LogicalExpression } from "../expression";
import type { EvaluationResultLogicalExpression } from "../evaluation-result";
import type { DescriptionContext } from "../../shared/frames";
import { formatPyObject } from "./helpers";
import { describeExpression } from "./describeSteps";

export function describeLogicalExpression(
  expression: Expression,
  result: EvaluationResultLogicalExpression,
  context: DescriptionContext
): string[] {
  const logicalExpr = expression as LogicalExpression;
  const left = formatPyObject(result.left.immutableJikiObject);
  const resultValue = formatPyObject(result.immutableJikiObject);
  const operatorSymbol = logicalExpr.operator.lexeme;

  // Short-circuit evaluation: right is null when the operator short-circuited.
  if (result.right === null) {
    return [
      ...describeExpression(logicalExpr.left, result.left, context),
      `<li>Python evaluated <code>${left}</code> and short-circuited the ${operatorSymbol} operation, returning <code>${resultValue}</code>.</li>`,
    ];
  }

  const right = formatPyObject(result.right.immutableJikiObject);
  const operatorName = operatorSymbol === "and" ? "evaluated logical and with" : "evaluated logical or with";
  return [
    ...describeExpression(logicalExpr.left, result.left, context),
    ...describeExpression(logicalExpr.right, result.right, context),
    `<li>Python ${operatorName} <code>${left}</code> and <code>${right}</code> to get <code>${resultValue}</code>.</li>`,
  ];
}
