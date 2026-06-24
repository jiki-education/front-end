import type { Executor } from "../executor";
import type { BinaryExpression } from "../expression";
import type { EvaluationResultExpression } from "../evaluation-result";
import { createJSObject, type JikiObject, JSNumber } from "../jikiObjects";
import { roundToDisplayPrecision } from "../jsObjects/JSNumber";
import { Fraction } from "../../shared/fraction";

export type ArithmeticOp = "+" | "-" | "*" | "/" | "%" | "**";

function roundResult(value: number): number {
  return roundToDisplayPrecision(value);
}

// Returns null when the operation can't stay rational (division/modulo by zero,
// non-integer exponents), signalling the caller to fall back to float maths.
function fractionOp(left: Fraction, right: Fraction, op: ArithmeticOp): Fraction | null {
  switch (op) {
    case "+":
      return left.add(right);
    case "-":
      return left.sub(right);
    case "*":
      return left.mul(right);
    case "/":
      return left.div(right);
    case "%":
      return left.mod(right);
    case "**":
      return left.pow(right);
  }
}

function floatOp(left: number, right: number, op: ArithmeticOp): number {
  switch (op) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      return left / right;
    case "%":
      return left % right;
    case "**":
      return left ** right;
  }
}

// Arithmetic on two numbers, preferring exact rational arithmetic so that
// mathematically equivalent expressions (e.g. `1/7 * x` and `x / 7`) agree.
// Falls back to float arithmetic (rounded to display precision) when either
// operand is inexact or the operation can't stay rational.
export function numberArithmetic(leftObj: JSNumber, rightObj: JSNumber, op: ArithmeticOp): JSNumber {
  if (leftObj.exact !== null && rightObj.exact !== null) {
    const result = fractionOp(leftObj.exact, rightObj.exact, op);
    if (result !== null) {
      return JSNumber.fromFraction(result);
    }
  }
  // Float fallback: reached when an operand is inexact, or when both are exact
  // but the op can't stay rational. For two exact operands that only means
  // div/mod by zero (-> Infinity/NaN) or a non-integer exponent (e.g. 2 ** 0.5);
  // add/sub/mul never return null here, so e.g. 0.5 + 0.5 stays on the exact
  // path. We re-attach an exact fraction only when the result is a whole number
  // (recovering cases like 4 ** 0.5 === 2). A non-integer float is left inexact
  // on purpose: trusting its rounded decimal would risk treating an irrational
  // result as exact.
  const value = roundResult(floatOp(leftObj.preciseValue, rightObj.preciseValue, op));
  const exact = Number.isInteger(value) && Number.isFinite(value) ? Fraction.fromInteger(value) : null;
  return new JSNumber(value, exact);
}

// Shared handling for -, *, /, %, ** : verifies operand types when coercion is
// disabled, uses exact arithmetic for number/number, and otherwise falls back
// to JS's coercing behaviour (rounded to display precision).
export function arithmeticWithCoercion(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression,
  op: ArithmeticOp
): JikiObject {
  if (!executor.languageFeatures.allowTypeCoercion) {
    verifyNumbersForArithmetic(executor, expression, leftResult, rightResult);
  }
  // The coercion case
  if (!(leftResult.jikiObject instanceof JSNumber && rightResult.jikiObject instanceof JSNumber)) {
    return createJSObject(roundResult(floatOp(leftResult.jikiObject.value, rightResult.jikiObject.value, op)));
  }

  // Normal case of two numbers
  return numberArithmetic(leftResult.jikiObject, rightResult.jikiObject, op);
}

function verifyNumbersForArithmetic(
  executor: Executor,
  expression: BinaryExpression,
  leftResult: EvaluationResultExpression,
  rightResult: EvaluationResultExpression
): void {
  const leftType = leftResult.jikiObject.type;
  const rightType = rightResult.jikiObject.type;

  if (leftType !== "number" || rightType !== "number") {
    executor.error("TypeCoercionNotAllowed", expression.location, {
      leftType,
      rightType,
      operator: expression.operator.lexeme,
    });
  }
}
