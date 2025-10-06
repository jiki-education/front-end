import type { Expression, UnaryExpression } from "../expression";
import type { EvaluationResultUnaryExpression } from "../evaluation-result";
import type { DescriptionContext } from "../../shared/frames";
import { formatPyObject } from "./helpers";
import { describeExpression } from "./describeSteps";

export function describeUnaryExpression(
  expression: Expression,
  result: EvaluationResultUnaryExpression,
  context: DescriptionContext
): string[] {
  const unaryExpr = expression as UnaryExpression;
  const operand = formatPyObject(result.operand.immutableJikiObject);
  const resultValue = formatPyObject(result.immutableJikiObject);

  const operatorType = unaryExpr.operator.type;
  let operatorDesc = "";

  switch (operatorType) {
    case "MINUS":
      operatorDesc = "negated";
      break;
    case "NOT":
      operatorDesc = "applied logical not to";
      break;
    default:
      operatorDesc = `applied ${operatorType} to`;
  }

  const steps = [
    ...describeExpression(unaryExpr.operand, result.operand, context),
    `<li>Python ${operatorDesc} <code>${operand}</code> to get <code>${resultValue}</code>.</li>`,
  ];

  return steps;
}
