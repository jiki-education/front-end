import type {
  EvaluationResult,
  EvaluationResultBinaryExpression,
  EvaluationResultExpression,
} from "../evaluation-result";
import type { Executor } from "../executor";
import type { BinaryExpression } from "../expression";
import * as JikiTypes from "../jikiObjects";

const DP_MULTIPLE = 100000;

export function executeBinaryExpression(
  executor: Executor,
  expression: BinaryExpression
): EvaluationResultBinaryExpression {
  const leftResult = executor.evaluate(expression.left);
  const rightResult = executor.evaluate(expression.right);

  guardLists(executor, expression, leftResult, rightResult);
  guardObjects(executor, expression, leftResult, rightResult);

  const jikiObject = handleExpression(executor, expression, leftResult, rightResult);
  const result: EvaluationResult = {
    type: "BinaryExpression",
    left: leftResult,
    right: rightResult,
    jikiObject: jikiObject,
    immutableJikiObject: jikiObject.clone(),
  };
  return result;
}

function handleExpression(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): any {
  switch (expression.operator.type) {
    case "INEQUALITY":
      return handleInequality(executor, expression, leftResult, rightResult);
    case "EQUALITY":
      return handleEquality(executor, expression, leftResult, rightResult);
    case "GREATER":
      return handleGreater(executor, expression, leftResult, rightResult);
    case "GREATER_EQUAL":
      return handleGreaterEqual(executor, expression, leftResult, rightResult);
    case "LESS":
      return handleLess(executor, expression, leftResult, rightResult);
    case "LESS_EQUAL":
      return handleLessEqual(executor, expression, leftResult, rightResult);
    case "MINUS":
      return handleMinus(executor, expression, leftResult, rightResult);
    case "PLUS":
      return handlePlus(executor, expression, leftResult, rightResult);
    case "SLASH":
      return handleSlash(executor, expression, leftResult, rightResult);
    case "STAR":
      return handleStar(executor, expression, leftResult, rightResult);
    case "PERCENT":
      return handlePercent(executor, expression, leftResult, rightResult);
    case "EQUAL":
      executor.error("UnexpectedEqualsOperatorForEqualityComparison", expression.location, {
        expression,
      });
      break;
    default:
      executor.error("InvalidBinaryExpressionOperation", expression.location, {
        expression,
      });
  }
}

function handleInequality(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): any {
  return new JikiTypes.Boolean(leftResult.jikiObject.value !== rightResult.jikiObject.value);
}

function handleEquality(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): any {
  return new JikiTypes.Boolean(leftResult.jikiObject.value === rightResult.jikiObject.value);
}

function handleGreater(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): any {
  executor.verifyNumber(leftResult.jikiObject, expression.left);
  executor.verifyNumber(rightResult.jikiObject, expression.right);
  return new JikiTypes.Boolean(leftResult.jikiObject.value > rightResult.jikiObject.value);
}

function handleGreaterEqual(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): any {
  executor.verifyNumber(leftResult.jikiObject, expression.left);
  executor.verifyNumber(rightResult.jikiObject, expression.right);
  return new JikiTypes.Boolean(leftResult.jikiObject.value >= rightResult.jikiObject.value);
}

function handleLess(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): any {
  executor.verifyNumber(leftResult.jikiObject, expression.left);
  executor.verifyNumber(rightResult.jikiObject, expression.right);
  return new JikiTypes.Boolean(leftResult.jikiObject.value < rightResult.jikiObject.value);
}

function handleLessEqual(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): any {
  executor.verifyNumber(leftResult.jikiObject, expression.left);
  executor.verifyNumber(rightResult.jikiObject, expression.right);
  return new JikiTypes.Boolean(leftResult.jikiObject.value <= rightResult.jikiObject.value);
}

function handleMinus(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): any {
  executor.verifyNumber(leftResult.jikiObject, expression.left);
  executor.verifyNumber(rightResult.jikiObject, expression.right);
  const minusValue = leftResult.jikiObject.value - rightResult.jikiObject.value;
  return new JikiTypes.Number(Math.round(minusValue * DP_MULTIPLE) / DP_MULTIPLE);
}

function handlePlus(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): any {
  executor.verifyNumber(leftResult.jikiObject, expression.left);
  executor.verifyNumber(rightResult.jikiObject, expression.right);
  const plusValue = leftResult.jikiObject.value + rightResult.jikiObject.value;
  return new JikiTypes.Number(Math.round(plusValue * DP_MULTIPLE) / DP_MULTIPLE);
}

function handleSlash(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): any {
  executor.verifyNumber(leftResult.jikiObject, expression.left);
  executor.verifyNumber(rightResult.jikiObject, expression.right);
  const slashValue = leftResult.jikiObject.value / rightResult.jikiObject.value;
  return new JikiTypes.Number(Math.round(slashValue * DP_MULTIPLE) / DP_MULTIPLE);
}

function handleStar(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): any {
  executor.verifyNumber(leftResult.jikiObject, expression.left);
  executor.verifyNumber(rightResult.jikiObject, expression.right);
  const starValue = leftResult.jikiObject.value * rightResult.jikiObject.value;
  return new JikiTypes.Number(Math.round(starValue * DP_MULTIPLE) / DP_MULTIPLE);
}

function handlePercent(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): any {
  executor.verifyNumber(leftResult.jikiObject, expression.left);
  executor.verifyNumber(rightResult.jikiObject, expression.right);
  return new JikiTypes.Number(leftResult.jikiObject.value % rightResult.jikiObject.value);
}

function guardLists(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
) {
  if (leftResult.jikiObject instanceof JikiTypes.List && rightResult.jikiObject instanceof JikiTypes.List) {
    executor.error("TypeErrorCannotCompareListObjects", expression.location);
  }
}

function guardObjects(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
) {
  if (leftResult.jikiObject instanceof JikiTypes.Instance || rightResult.jikiObject instanceof JikiTypes.Instance) {
    executor.error("TypeErrorCannotCompareObjectInstances", expression.location);
  }
}
