import type { Executor } from "../executor";
import type { UnaryExpression } from "../expression";
import type { EvaluationResultUnaryExpression, EvaluationResultExpression } from "../evaluation-result";
import { createPyObject, PyBoolean, type JikiObject } from "../jikiObjects";

export function executeUnaryExpression(
  executor: Executor,
  expression: UnaryExpression
): EvaluationResultUnaryExpression {
  const rightResult = executor.evaluate(expression.operand);

  const result = handleUnaryOperation(executor, expression, rightResult);

  return {
    type: "UnaryExpression",
    operand: rightResult,
    jikiObject: result,
    immutableJikiObject: result.clone(),
  };
}

function handleUnaryOperation(
  executor: Executor,
  expression: UnaryExpression,
  rightResult: EvaluationResultExpression
): JikiObject {
  const rightObject = rightResult.jikiObject;

  switch (expression.operator.type) {
    case "MINUS":
      return createPyObject(-rightObject.value);
    case "NOT":
      // Check if truthiness is disabled and we have a non-boolean
      if (!executor.languageFeatures.allowTruthiness && rightObject.type !== "boolean") {
        executor.error("TruthinessDisabled", expression.location, {
          value: rightObject.type,
        });
      }

      // Apply Python's truthiness rules
      return new PyBoolean(!isTruthy(rightObject));
    default:
      executor.error("InvalidUnaryExpression", expression.location, {
        operator: expression.operator.type,
      });
  }
}

// Python truthiness rules
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
