import type { Executor } from "../executor";
import type { LogicalExpression } from "../expression";
import type { EvaluationResultLogicalExpression, EvaluationResultExpression } from "../evaluation-result";
import type { JikiObject } from "../jikiObjects";

export function executeLogicalExpression(
  executor: Executor,
  expression: LogicalExpression
): EvaluationResultLogicalExpression {
  const leftResult = executor.evaluate(expression.left);
  const leftObject = leftResult.jikiObject;

  // Check if truthiness is disabled for non-boolean values
  if (!executor.languageFeatures.allowTruthiness && leftObject.type !== "boolean") {
    executor.error("TruthinessDisabled", expression.left.location, {
      value: leftObject.type,
    });
  }

  const leftTruthy = isTruthy(leftObject);

  if (expression.operator.type === "AND") {
    // Python's 'and' returns the first falsy value or the last value
    if (!leftTruthy) {
      // Short-circuit: return left value if it's falsy
      return buildResult(leftResult, null, leftObject);
    }

    const rightResult = executor.evaluate(expression.right);
    verifyRightTruthiness(executor, expression, rightResult);
    return buildResult(leftResult, rightResult, rightResult.jikiObject);
  }

  // OR: Python's 'or' returns the first truthy value or the last value
  if (leftTruthy) {
    // Short-circuit: return left value if it's truthy
    return buildResult(leftResult, null, leftObject);
  }

  const rightResult = executor.evaluate(expression.right);
  verifyRightTruthiness(executor, expression, rightResult);
  return buildResult(leftResult, rightResult, rightResult.jikiObject);
}

function verifyRightTruthiness(
  executor: Executor,
  expression: LogicalExpression,
  rightResult: EvaluationResultExpression
): void {
  const rightObject = rightResult.jikiObject;
  if (!executor.languageFeatures.allowTruthiness && rightObject.type !== "boolean") {
    executor.error("TruthinessDisabled", expression.right.location, {
      value: rightObject.type,
    });
  }
}

function buildResult(
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression | null,
  jikiObject: JikiObject
): EvaluationResultLogicalExpression {
  return {
    type: "LogicalExpression",
    left: leftResult,
    right: rightResult,
    jikiObject,
    immutableJikiObject: jikiObject.clone(),
  };
}

// Python truthiness rules (same as in executeUnaryExpression)
function isTruthy(obj: JikiObject): boolean {
  const value = obj.value;
  const type = obj.type;

  // Python falsy values: False, None, 0, 0.0, "", [], {}, set()
  if (type === "boolean") {
    return value as boolean;
  }
  if (type === "none") {
    return false;
  }
  if (type === "number") {
    return value !== 0;
  }
  if (type === "string") {
    return (value as string).length > 0;
  }

  // For now, we'll treat any other type as truthy
  // This will be expanded when we add lists, dicts, etc.
  return true;
}
