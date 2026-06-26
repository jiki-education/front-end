import type { Executor } from "../executor";
import type { BinaryExpression } from "../expression";
import type { EvaluationResultBinaryExpression, EvaluationResultExpression } from "../evaluation-result";
import { createJSObject, type JikiObject, JSDictionary, JSArray, type JSNumber } from "../jikiObjects";
import { numberArithmetic, arithmeticWithCoercion } from "./arithmetic";
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
      // Number addition uses exact arithmetic regardless of the coercion flag.
      if (leftType === "number" && rightType === "number") {
        return numberArithmetic(leftResult.jikiObject as JSNumber, rightResult.jikiObject as JSNumber, "+");
      }
      // With coercion disabled, only string concatenation is also allowed;
      // anything else is an error.
      if (!executor.languageFeatures.allowTypeCoercion) {
        if (leftType === "string" && rightType === "string") {
          return createJSObject(left + right);
        }
        executor.error("TypeCoercionNotAllowed", expression.location, {
          leftType,
          rightType,
          operator: expression.operator.lexeme,
        });
      }
      // Coercion enabled: defer to JS (concatenation / coercion).
      return createJSObject(left + right);

    case "MINUS":
      return arithmeticWithCoercion(executor, expression, leftResult, rightResult, "-");

    case "STAR":
      return arithmeticWithCoercion(executor, expression, leftResult, rightResult, "*");

    case "STAR_STAR":
      return arithmeticWithCoercion(executor, expression, leftResult, rightResult, "**");

    case "SLASH":
      return arithmeticWithCoercion(executor, expression, leftResult, rightResult, "/");

    case "PERCENT":
      return arithmeticWithCoercion(executor, expression, leftResult, rightResult, "%");

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
        executor.error("StrictEqualityRequired", expression.location, {
          operator: expression.operator.lexeme,
        });
      }
      // eslint-disable-next-line eqeqeq
      return createJSObject(left == right);

    case "NOT_EQUAL":
      // Check if strict equality is enforced
      if (executor.languageFeatures.enforceStrictEquality) {
        executor.error("StrictEqualityRequired", expression.location, {
          operator: expression.operator.lexeme,
        });
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

    case "IN": {
      // Array: gated behind allowInWithArrays language feature
      if (rightResult.jikiObject instanceof JSArray) {
        if (!executor.languageFeatures.allowInWithArrays) {
          throw new RuntimeError(`InWithArrayNotAllowed`, expression.location, "InWithArrayNotAllowed");
        }
        // When enabled, check if index exists in array
        const index = Number(left);
        if (Number.isNaN(index) || !Number.isInteger(index)) {
          throw new RuntimeError(
            `InOperatorRequiresIntegerIndex: type: ${leftType}`,
            expression.location,
            "InOperatorRequiresIntegerIndex"
          );
        }
        return createJSObject(index >= 0 && index < rightResult.jikiObject.length);
      }

      // Right-hand side must be a dictionary
      if (!(rightResult.jikiObject instanceof JSDictionary)) {
        throw new RuntimeError(
          `InOperatorRequiresObject: type: ${rightType}`,
          expression.location,
          "InOperatorRequiresObject"
        );
      }

      // Left-hand side must be a string (the key to check)
      if (leftType !== "string") {
        throw new RuntimeError(
          `InOperatorRequiresStringKey: type: ${leftType}`,
          expression.location,
          "InOperatorRequiresStringKey"
        );
      }

      return createJSObject(rightResult.jikiObject.value.has(left));
    }

    default:
      throw new RuntimeError(
        `Unsupported binary operator: ${expression.operator.type}`,
        expression.location,
        "InvalidBinaryExpression"
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
