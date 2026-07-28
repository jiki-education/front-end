import type { EvaluationResultLogicalExpression } from "../evaluation-result";
import type { LogicalExpression } from "../expression";
import type { DescriptionContext } from "../../shared/frames";
import { codeTag, formatJSObject } from "../helpers";
import { describeExpression } from "./describeSteps";

export function describeLogicalExpression(
  expression: LogicalExpression,
  result: EvaluationResultLogicalExpression,
  context: DescriptionContext
) {
  if (result.shortCircuited || result.right === null) {
    return describeShortCircuitedExpression(expression, result, context);
  }

  const leftSteps = describeExpression(expression.left, result.left, context);
  const rightSteps = describeExpression(expression.right, result.right, context);

  const leftRes = formatJSObject(result.left.immutableJikiObject);
  const op = expression.operator.lexeme;
  const rightRes = formatJSObject(result.right.immutableJikiObject);

  const finalStep = `<li>Jiki evaluated ${codeTag(
    `${leftRes} ${op} ${rightRes}`,
    expression.location
  )} and determined it was ${codeTag(result.immutableJikiObject, expression.location)}.</li>`;
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
    `<li>Jiki saw the left side of the ${codeTag(
      expression.operator.lexeme,
      expression.operator.location
    )} was ${codeTag(leftRes, expression.left.location)} and so did not need to look at the right side.</li>`,
  ];
}
