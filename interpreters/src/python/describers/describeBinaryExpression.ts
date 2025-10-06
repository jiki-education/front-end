import type { Expression, BinaryExpression } from "../expression";
import type { EvaluationResultBinaryExpression } from "../evaluation-result";
import type { DescriptionContext } from "../../shared/frames";
import { formatPyObject } from "./helpers";
import { describeExpression } from "./describeSteps";

export function describeBinaryExpression(
  expression: Expression,
  result: EvaluationResultBinaryExpression,
  context: DescriptionContext
): string[] {
  const binaryExpr = expression as BinaryExpression;
  const left = formatPyObject(result.left.immutableJikiObject);
  const resultValue = formatPyObject(result.immutableJikiObject);

  const operatorSymbol = binaryExpr.operator.lexeme;
  const operatorName = getOperatorName(operatorSymbol);

  // Handle short-circuit evaluation for logical operators
  // result.right can be null for short-circuited logical operators
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if ((operatorSymbol === "and" || operatorSymbol === "or") && result.right === null) {
    const steps = [
      ...describeExpression(binaryExpr.left, result.left, context),
      `<li>Python evaluated <code>${left}</code> and short-circuited the ${operatorSymbol} operation, returning <code>${resultValue}</code>.</li>`,
    ];
    return steps;
  }

  // Safety check for right - defensive programming in case of logic errors
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!result.right) {
    return [`<li>Python evaluated binary expression and got <code>${resultValue}</code>.</li>`];
  }

  const right = formatPyObject(result.right.immutableJikiObject);
  const steps = [
    ...describeExpression(binaryExpr.left, result.left, context),
    ...describeExpression(binaryExpr.right, result.right, context),
    `<li>Python ${operatorName} <code>${left}</code> and <code>${right}</code> to get <code>${resultValue}</code>.</li>`,
  ];

  return steps;
}

function getOperatorName(operator: string): string {
  switch (operator) {
    case "+":
      return "added";
    case "-":
      return "subtracted";
    case "*":
      return "multiplied";
    case "/":
      return "divided";
    case "//":
      return "floor divided";
    case "%":
      return "calculated the remainder of";
    case "**":
      return "raised to the power";
    case "===":
      return "checked if equal";
    case "!==":
      return "checked if not equal";
    case "<":
      return "checked if less than";
    case "<=":
      return "checked if less than or equal";
    case ">":
      return "checked if greater than";
    case ">=":
      return "checked if greater than or equal";
    case "and":
      return "evaluated logical and with";
    case "or":
      return "evaluated logical or with";
    default:
      return `applied ${operator} to`;
  }
}
