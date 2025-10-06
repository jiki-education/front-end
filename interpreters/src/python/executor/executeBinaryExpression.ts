import type { Executor } from "../executor";
import type { BinaryExpression } from "../expression";
import type { EvaluationResultBinaryExpression, EvaluationResultExpression } from "../evaluation-result";
import { createPyObject, type JikiObject, PyBoolean } from "../jikiObjects";

export function executeBinaryExpression(
  executor: Executor,
  expression: BinaryExpression
): EvaluationResultBinaryExpression {
  const leftResult = executor.evaluate(expression.left);

  // For logical operators, we need to check truthiness before evaluating the right side
  // This also implements short-circuit evaluation
  if (expression.operator.type === "AND" || expression.operator.type === "OR") {
    return handleLogicalOperation(executor, expression, leftResult);
  }

  const rightResult = executor.evaluate(expression.right);

  const result = handleBinaryOperation(executor, expression, leftResult, rightResult);

  return {
    type: "BinaryExpression",
    left: leftResult,
    right: rightResult,
    jikiObject: result,
    immutableJikiObject: result.clone(),
  };
}

function handleBinaryOperation(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): JikiObject {
  switch (expression.operator.type) {
    // Arithmetic operations
    case "PLUS":
      return handlePlusOperation(executor, expression, leftResult, rightResult);
    case "MINUS":
      return handleMinusOperation(executor, expression, leftResult, rightResult);
    case "STAR":
      return handleMultiplyOperation(executor, expression, leftResult, rightResult);
    case "SLASH":
      return handleDivisionOperation(executor, expression, leftResult, rightResult);
    case "DOUBLE_SLASH":
      return handleFloorDivisionOperation(executor, expression, leftResult, rightResult);
    case "PERCENT":
      return handleModuloOperation(executor, expression, leftResult, rightResult);
    case "DOUBLE_STAR":
      return handlePowerOperation(executor, expression, leftResult, rightResult);

    // Comparison operations
    case "GREATER":
      return handleGreaterOperation(leftResult, rightResult);
    case "GREATER_EQUAL":
      return handleGreaterEqualOperation(leftResult, rightResult);
    case "LESS":
      return handleLessOperation(leftResult, rightResult);
    case "LESS_EQUAL":
      return handleLessEqualOperation(leftResult, rightResult);
    case "EQUAL_EQUAL":
      return handleEqualOperation(leftResult, rightResult);
    case "NOT_EQUAL":
      return handleNotEqualOperation(leftResult, rightResult);

    default:
      executor.error("InvalidBinaryExpression", expression.location, {
        operator: expression.operator.type,
      });
  }
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

function handleLogicalOperation(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression
): EvaluationResultBinaryExpression {
  const leftObject = leftResult.jikiObject;

  // Check if truthiness is disabled for non-boolean values
  if (!executor.languageFeatures.allowTruthiness && leftObject.type !== "boolean") {
    executor.error("TruthinessDisabled", expression.left.location, {
      value: leftObject.type,
    });
  }

  const leftTruthy = isTruthy(leftObject);

  if (expression.operator.type === "AND") {
    // Python's 'and' operator returns the first falsy value or the last value
    if (!leftTruthy) {
      // Short-circuit: return left value if it's falsy
      return {
        type: "BinaryExpression",
        left: leftResult,
        right: null,
        jikiObject: leftObject,
        immutableJikiObject: leftObject.clone(),
      } as any;
    }

    // Evaluate the right side
    const rightResult = executor.evaluate(expression.right);
    const rightObject = rightResult.jikiObject;

    // Check truthiness for the right operand
    if (!executor.languageFeatures.allowTruthiness && rightObject.type !== "boolean") {
      executor.error("TruthinessDisabled", expression.right.location, {
        value: rightObject.type,
      });
    }

    // Return the right value (Python semantics)
    return {
      type: "BinaryExpression",
      left: leftResult,
      right: rightResult,
      jikiObject: rightObject,
      immutableJikiObject: rightObject.clone(),
    } as any;
  }
  // OR
  // Python's 'or' operator returns the first truthy value or the last value
  if (leftTruthy) {
    // Short-circuit: return left value if it's truthy
    return {
      type: "BinaryExpression",
      left: leftResult,
      right: null,
      jikiObject: leftObject,
      immutableJikiObject: leftObject.clone(),
    } as any;
  }

  // Evaluate the right side
  const rightResult = executor.evaluate(expression.right);
  const rightObject = rightResult.jikiObject;

  // Check truthiness for the right operand
  if (!executor.languageFeatures.allowTruthiness && rightObject.type !== "boolean") {
    executor.error("TruthinessDisabled", expression.right.location, {
      value: rightObject.type,
    });
  }

  // Return the right value (Python semantics)
  return {
    type: "BinaryExpression",
    left: leftResult,
    right: rightResult,
    jikiObject: rightObject,
    immutableJikiObject: rightObject.clone(),
  } as any;
}

// Arithmetic operation handlers
function handlePlusOperation(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): JikiObject {
  const left = leftResult.jikiObject.value;
  const right = rightResult.jikiObject.value;
  const leftType = leftResult.jikiObject.type;
  const rightType = rightResult.jikiObject.type;

  // Check for type coercion when disabled
  if (!executor.languageFeatures.allowTypeCoercion) {
    // Allow string concatenation (string + string)
    if (leftType === "string" && rightType === "string") {
      return createPyObject(left + right);
    }
    // Allow number addition (number + number)
    if (leftType === "number" && rightType === "number") {
      return createPyObject(left + right);
    }
    // Everything else is type coercion and should error
    executor.error("TypeCoercionNotAllowed", expression.location, {
      operator: expression.operator.lexeme,
      details: `left: ${leftType}: right: ${rightType}`,
    });
  }

  // With type coercion enabled, Python still doesn't allow string + number
  if ((leftType === "string" && rightType !== "string") || (leftType !== "string" && rightType === "string")) {
    executor.error("TypeCoercionNotAllowed", expression.location, {
      operator: expression.operator.lexeme,
      details: `left: ${leftType}: right: ${rightType}`,
    });
  }

  return createPyObject(left + right);
}

function handleMinusOperation(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): JikiObject {
  if (!executor.languageFeatures.allowTypeCoercion) {
    verifyNumbersForArithmetic(executor, expression, leftResult, rightResult);
  }

  const left = leftResult.jikiObject.value;
  const right = rightResult.jikiObject.value;
  return createPyObject(left - right);
}

function handleMultiplyOperation(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): JikiObject {
  const left = leftResult.jikiObject.value;
  const right = rightResult.jikiObject.value;
  const leftType = leftResult.jikiObject.type;
  const rightType = rightResult.jikiObject.type;

  if (!executor.languageFeatures.allowTypeCoercion) {
    // For type coercion disabled, allow string * number and number * string (Python behavior)
    if (leftType === "string" && rightType === "number") {
      return createPyObject((left as string).repeat(right as number));
    }
    if (leftType === "number" && rightType === "string") {
      return createPyObject((right as string).repeat(left as number));
    }
    // Allow number * number
    if (leftType === "number" && rightType === "number") {
      return createPyObject(left * right);
    }
    // Everything else is type coercion and should error
    if (leftType !== "number") {
      executor.error("TypeCoercionNotAllowed", expression.location, {
        operator: expression.operator.lexeme,
        details: `left: ${leftType}`,
      });
    }
    if (rightType !== "number") {
      executor.error("TypeCoercionNotAllowed", expression.location, {
        operator: expression.operator.lexeme,
        details: `right: ${rightType}`,
      });
    }
  }

  // With type coercion enabled, handle string repetition and regular multiplication
  if (leftType === "string" && rightType === "number") {
    return createPyObject((left as string).repeat(right as number));
  }
  if (leftType === "number" && rightType === "string") {
    return createPyObject((right as string).repeat(left as number));
  }

  return createPyObject(left * right);
}

function handleDivisionOperation(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): JikiObject {
  if (!executor.languageFeatures.allowTypeCoercion) {
    verifyNumbersForArithmetic(executor, expression, leftResult, rightResult);
  }

  const left = leftResult.jikiObject.value;
  const right = rightResult.jikiObject.value;
  return createPyObject(left / right);
}

function handleFloorDivisionOperation(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): JikiObject {
  if (!executor.languageFeatures.allowTypeCoercion) {
    verifyNumbersForArithmetic(executor, expression, leftResult, rightResult);
  }

  const left = leftResult.jikiObject.value;
  const right = rightResult.jikiObject.value;
  return createPyObject(Math.floor(left / right));
}

function handleModuloOperation(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): JikiObject {
  if (!executor.languageFeatures.allowTypeCoercion) {
    verifyNumbersForArithmetic(executor, expression, leftResult, rightResult);
  }

  const left = leftResult.jikiObject.value;
  const right = rightResult.jikiObject.value;
  return createPyObject(left % right);
}

function handlePowerOperation(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): JikiObject {
  if (!executor.languageFeatures.allowTypeCoercion) {
    verifyNumbersForArithmetic(executor, expression, leftResult, rightResult);
  }

  const left = leftResult.jikiObject.value;
  const right = rightResult.jikiObject.value;
  return createPyObject(Math.pow(left, right));
}

// Comparison operation handlers
function handleGreaterOperation(
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): JikiObject {
  const left = leftResult.jikiObject.value;
  const right = rightResult.jikiObject.value;
  return new PyBoolean(left > right);
}

function handleGreaterEqualOperation(
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): JikiObject {
  const left = leftResult.jikiObject.value;
  const right = rightResult.jikiObject.value;
  return new PyBoolean(left >= right);
}

function handleLessOperation(
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): JikiObject {
  const left = leftResult.jikiObject.value;
  const right = rightResult.jikiObject.value;
  return new PyBoolean(left < right);
}

function handleLessEqualOperation(
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): JikiObject {
  const left = leftResult.jikiObject.value;
  const right = rightResult.jikiObject.value;
  return new PyBoolean(left <= right);
}

function handleEqualOperation(
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): JikiObject {
  const left = leftResult.jikiObject.value;
  const right = rightResult.jikiObject.value;
  return new PyBoolean(left === right);
}

function handleNotEqualOperation(
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): JikiObject {
  const left = leftResult.jikiObject.value;
  const right = rightResult.jikiObject.value;
  return new PyBoolean(left !== right);
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
    executor.error("TypeCoercionNotAllowed", expression.location, {
      operator: expression.operator.lexeme,
      details: `left: ${leftType}`,
    });
  }
  if (rightType !== "number") {
    executor.error("TypeCoercionNotAllowed", expression.location, {
      operator: expression.operator.lexeme,
      details: `right: ${rightType}`,
    });
  }
}
