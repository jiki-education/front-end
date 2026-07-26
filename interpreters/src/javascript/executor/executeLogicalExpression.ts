import type { Executor } from "../executor";
import type { LogicalExpression } from "../expression";
import type { EvaluationResultLogicalExpression } from "../evaluation-result";
import { createJSObject } from "../jikiObjects";
import { InterpreterInternalError } from "../error";

export function executeLogicalExpression(
  executor: Executor,
  expression: LogicalExpression
): EvaluationResultLogicalExpression {
  const leftResult = executor.evaluate(expression.left);
  const rightResult = executor.evaluate(expression.right);

  executor.verifyBoolean(leftResult.jikiObject, expression.left.location);
  executor.verifyBoolean(rightResult.jikiObject, expression.right.location);

  const left = leftResult.jikiObject.value;
  const right = rightResult.jikiObject.value;

  let value: boolean;
  switch (expression.operator.type) {
    case "LOGICAL_AND":
      value = left && right;
      break;
    case "LOGICAL_OR":
      value = left || right;
      break;
    default:
      // The parser only emits LogicalExpression for && and ||, so reaching
      // here is an interpreter bug, not a student error.
      throw new InterpreterInternalError(`Unsupported logical operator: ${expression.operator.type}`);
  }

  const result = createJSObject(value);

  return {
    type: "LogicalExpression",
    left: leftResult,
    right: rightResult,
    jikiObject: result,
    immutableJikiObject: result.clone(),
  } as any;
}
