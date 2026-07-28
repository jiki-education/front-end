import type { Executor } from "../executor";
import type { LogicalExpression } from "../expression";
import type { EvaluationResultLogicalExpression, EvaluationResultExpression } from "../evaluation-result";
import { isTruthy } from "../helpers";
import { InterpreterInternalError } from "../error";

export function executeLogicalExpression(
  executor: Executor,
  expression: LogicalExpression
): EvaluationResultLogicalExpression {
  const leftResult = executor.evaluate(expression.left);
  // isTruthy enforces the TruthinessDisabled check (when truthiness is off, a
  // non-boolean operand errors here) and otherwise computes JS truthiness the
  // same way if/while conditions do - keeping all three consistent.
  const leftTruthy = isTruthy(executor, leftResult.jikiObject, expression.left.location);

  // Short-circuit: only evaluate the right side when the operator requires it.
  // This matches JavaScript semantics - `false && x` and `true || x` must never
  // evaluate `x` (which may itself throw, e.g. an out-of-bounds index access).
  // Logical operators return the operand that decided the result, not a coerced
  // boolean, so we hand back the relevant side's jikiObject verbatim.
  switch (expression.operator.type) {
    case "LOGICAL_AND":
      if (!leftTruthy) {
        return shortCircuitResult(leftResult);
      }
      break;
    case "LOGICAL_OR":
      if (leftTruthy) {
        return shortCircuitResult(leftResult);
      }
      break;
    default:
      // The parser only emits LogicalExpression for && and ||, so reaching
      // here is an interpreter bug, not a student error.
      throw new InterpreterInternalError(`Unsupported logical operator: ${expression.operator.type}`);
  }

  const rightResult = executor.evaluate(expression.right);
  executor.verifyBoolean(rightResult.jikiObject, expression.right.location);
  return {
    type: "LogicalExpression",
    shortCircuited: false,
    left: leftResult,
    right: rightResult,
    jikiObject: rightResult.jikiObject,
    immutableJikiObject: rightResult.jikiObject.clone(),
  };
}

function shortCircuitResult(leftResult: EvaluationResultExpression): EvaluationResultLogicalExpression {
  return {
    type: "LogicalExpression",
    shortCircuited: true,
    left: leftResult,
    right: null,
    jikiObject: leftResult.jikiObject,
    immutableJikiObject: leftResult.jikiObject.clone(),
  };
}
