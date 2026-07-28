import type { EvaluationResultUnaryExpression } from "../evaluation-result";
import type { UnaryExpression } from "../expression";
import type { DescriptionContext } from "./types";
import { codeTag } from "../helpers";
import { describeExpression } from "./describeSteps";
import type * as JS from "../jikiObjects";

export function describeUnaryExpression(
  expression: UnaryExpression,
  result: EvaluationResultUnaryExpression,
  context: DescriptionContext
) {
  if (expression.operator.type === "NOT") {
    return describeNotExpression(expression, result, context);
  }
  if (expression.operator.type === "MINUS") {
    return describeMinusExpression(expression, result, context);
  }
  return [];
}

function describeNotExpression(
  expression: UnaryExpression,
  result: EvaluationResultUnaryExpression,
  context: DescriptionContext
) {
  const resBool = result.operand.immutableJikiObject as JS.JSBoolean;
  let steps = describeExpression(expression.operand, result.operand, context);
  steps = [
    ...steps,
    context.t("description.unaryExpression.not", {
      expr: codeTag(`!${resBool}`, expression.operand.location),
      value: codeTag(result.immutableJikiObject, expression.location),
    }),
  ];
  return steps;
}

function describeMinusExpression(
  expression: UnaryExpression,
  result: EvaluationResultUnaryExpression,
  context: DescriptionContext
) {
  // If this is a negative number, there's no steps to show.
  if (expression.operand.type === "LiteralExpression") {
    return [];
  }
  const resNum = result.operand.immutableJikiObject as JS.JSNumber;
  let steps = describeExpression(expression.operand, result.operand, context);
  steps = [
    ...steps,
    context.t("description.unaryExpression.minus", {
      expr: codeTag(`-${resNum}`, expression.operand.location),
      value: codeTag(result.immutableJikiObject, expression.location),
    }),
  ];
  return steps;
}
