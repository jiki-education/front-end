import type { EvaluationResultBinaryExpression, EvaluationResultExpression } from "../evaluation-result";
import type { BinaryExpression } from "../expression";
import type { DescriptionContext } from "../../shared/frames";
import { codeTag, formatJikiObject } from "../helpers";
import { describeExpression } from "./describeSteps";

export function describeBinaryExpression(
  expression: BinaryExpression,
  result: EvaluationResultBinaryExpression,
  context: DescriptionContext
) {
  const leftSteps = describeExpression(expression.left, result.left, context);
  const rightSteps = describeExpression(expression.right, result.right, context);

  const left = result.left as EvaluationResultExpression;
  const right = result.right as EvaluationResultExpression;
  const leftRes = formatJikiObject(left.immutableJikiObject);
  const op = expression.operator.lexeme;
  const rightRes = formatJikiObject(right.immutableJikiObject);

  const finalStep = `<li>Jiki evaluated ${codeTag(
    `${leftRes} ${op} ${rightRes}`,
    expression.location
  )} and determined it was ${codeTag(result.immutableJikiObject, expression.location)}.</li>`;
  return [...leftSteps, ...rightSteps, finalStep];
}
