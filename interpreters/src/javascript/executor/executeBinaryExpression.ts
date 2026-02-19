import type { Executor } from "../executor";
import type { BinaryExpression } from "../expression";
import type { EvaluationResultBinaryExpression, EvaluationResultExpression } from "../evaluation-result";
import { createJSObject, type JikiObject } from "../jikiObjects";
import { RuntimeError } from "../executor";

export function executeBinaryExpression(
  executor: Executor,
  expression: BinaryExpression
): EvaluationResultBinaryExpression {
  const leftResult = executor.evaluate(expression.left);
  const rightResult = executor.evaluate(expression.right);

  const result = handleBinaryOperation(executor, expression, leftResult, rightResult);

  return {
    type: "BinaryExpression",
    left: leftResult,
    right: rightResult,
    jikiObject: result,
    immutableJikiObject: result.clone(),
  } as any;
}

function handleBinaryOperation(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): JikiObject {
  const left = leftResult.jikiObject.value;
  const right = rightResult.jikiObject.value;
  const leftType = leftResult.jikiObject.type;
  const rightType = rightResult.jikiObject.type;

  switch (expression.operator.type) {
    case "PLUS":
      // Check for type coercion when disabled
      if (!executor.languageFeatures.allowTypeCoercion) {
        // Allow string concatenation (string + string)
        if (leftType === "string" && rightType === "string") {
          return createJSObject(left + right);
        }
        // Allow number addition (number + number)
        if (leftType === "number" && rightType === "number") {
          return createJSObject(left + right);
        }
        // Everything else is type coercion and should error
        throw new RuntimeError(
          `TypeCoercionNotAllowed: operator: ${expression.operator.lexeme}: left: ${leftType}: right: ${rightType}`,
          expression.location,
          "TypeCoercionNotAllowed"
        );
      }
      return createJSObject(left + right);

    case "MINUS":
      if (!executor.languageFeatures.allowTypeCoercion) {
        verifyNumbersForArithmetic(executor, expression, leftResult, rightResult);
      }
      return createJSObject(left - right);

    case "STAR":
      if (!executor.languageFeatures.allowTypeCoercion) {
        verifyNumbersForArithmetic(executor, expression, leftResult, rightResult);
      }
      return createJSObject(left * right);

    case "STAR_STAR":
      if (!executor.languageFeatures.allowTypeCoercion) {
        verifyNumbersForArithmetic(executor, expression, leftResult, rightResult);
      }
      return createJSObject(left ** right);

    case "SLASH":
      if (!executor.languageFeatures.allowTypeCoercion) {
        verifyNumbersForArithmetic(executor, expression, leftResult, rightResult);
      }
      return createJSObject(left / right);

    case "PERCENT":
      if (!executor.languageFeatures.allowTypeCoercion) {
        verifyNumbersForArithmetic(executor, expression, leftResult, rightResult);
      }
      return createJSObject(left % right);

    case "LOGICAL_AND":
      executor.verifyBoolean(leftResult.jikiObject, expression.left.location);
      executor.verifyBoolean(rightResult.jikiObject, expression.right.location);
      return createJSObject(left && right);

    case "LOGICAL_OR":
      executor.verifyBoolean(leftResult.jikiObject, expression.left.location);
      executor.verifyBoolean(rightResult.jikiObject, expression.right.location);
      return createJSObject(left || right);

    case "EQUAL_EQUAL":
      // Check if strict equality is enforced
      if (executor.languageFeatures.enforceStrictEquality) {
        throw new RuntimeError(
          `StrictEqualityRequired: operator: ${expression.operator.lexeme}`,
          expression.location,
          "StrictEqualityRequired"
        );
      }
      // eslint-disable-next-line eqeqeq
      return createJSObject(left == right);

    case "NOT_EQUAL":
      // Check if strict equality is enforced
      if (executor.languageFeatures.enforceStrictEquality) {
        throw new RuntimeError(
          `StrictEqualityRequired: operator: ${expression.operator.lexeme}`,
          expression.location,
          "StrictEqualityRequired"
        );
      }
      // eslint-disable-next-line eqeqeq
      return createJSObject(left != right);

    case "STRICT_EQUAL":
      return createJSObject(left === right);

    case "NOT_STRICT_EQUAL":
      return createJSObject(left !== right);

    case "GREATER":
      verifyNumbersForComparison(executor, expression, leftResult, rightResult);
      return createJSObject(left > right);

    case "GREATER_EQUAL":
      verifyNumbersForComparison(executor, expression, leftResult, rightResult);
      return createJSObject(left >= right);

    case "LESS":
      verifyNumbersForComparison(executor, expression, leftResult, rightResult);
      return createJSObject(left < right);

    case "LESS_EQUAL":
      verifyNumbersForComparison(executor, expression, leftResult, rightResult);
      return createJSObject(left <= right);

    default:
      throw new RuntimeError(
        `Unsupported binary operator: ${expression.operator.type}`,
        expression.location,
        "InvalidBinaryExpression"
      );
  }
}

function verifyNumbersForArithmetic(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): void {
  const leftType = leftResult.jikiObject.type;
  const rightType = rightResult.jikiObject.type;

  if (leftType !== "number") {
    throw new RuntimeError(
      `TypeCoercionNotAllowed: operator: ${expression.operator.lexeme}: left: ${leftType}`,
      expression.location,
      "TypeCoercionNotAllowed"
    );
  }
  if (rightType !== "number") {
    throw new RuntimeError(
      `TypeCoercionNotAllowed: operator: ${expression.operator.lexeme}: right: ${rightType}`,
      expression.location,
      "TypeCoercionNotAllowed"
    );
  }
}

function verifyNumbersForComparison(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): void {
  if (typeof leftResult.jikiObject.value !== "number") {
    throw new RuntimeError(
      `ComparisonRequiresNumber: operator: ${expression.operator.lexeme}: left: ${leftResult.jikiObject.type}`,
      expression.location,
      "ComparisonRequiresNumber"
    );
  }
  if (typeof rightResult.jikiObject.value !== "number") {
    throw new RuntimeError(
      `ComparisonRequiresNumber: operator: ${expression.operator.lexeme}: right: ${rightResult.jikiObject.type}`,
      expression.location,
      "ComparisonRequiresNumber"
    );
  }
}
