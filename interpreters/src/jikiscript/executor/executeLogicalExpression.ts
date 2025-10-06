import type { Executor } from "../executor";
import type { LogicalExpression } from "../expression";
import type { EvaluationResult, EvaluationResultLogicalExpression } from "../evaluation-result";
import * as Jiki from "../jikiObjects";

export function executeLogicalExpression(
  executor: Executor,
  expression: LogicalExpression
): EvaluationResultLogicalExpression {
  if (expression.operator.type === "OR") {
    const leftOr = executor.evaluate(expression.left);
    executor.verifyBoolean(leftOr.jikiObject, expression.left);

    let rightOr: EvaluationResult | undefined = undefined;

    if (!leftOr.jikiObject.value) {
      rightOr = executor.evaluate(expression.right);
      executor.verifyBoolean(rightOr.jikiObject, expression.right);
    }

    const jikiObject = new Jiki.Boolean(leftOr.jikiObject.value || rightOr?.jikiObject.value);
    return {
      jikiObject,
      immutableJikiObject: jikiObject.clone(),
      type: "LogicalExpression",
      left: leftOr,
      right: rightOr,
      shortCircuited: rightOr === undefined,
    };
  }

  const leftAnd = executor.evaluate(expression.left);
  executor.verifyBoolean(leftAnd.jikiObject, expression.left);

  let rightAnd: EvaluationResult | undefined = undefined;

  if (leftAnd.jikiObject.value) {
    rightAnd = executor.evaluate(expression.right);
    executor.verifyBoolean(rightAnd.jikiObject, expression.right);
  }

  const jikiObject = new Jiki.Boolean(leftAnd.jikiObject.value && rightAnd?.jikiObject.value);

  return {
    jikiObject: jikiObject,
    immutableJikiObject: jikiObject.clone(),
    type: "LogicalExpression",
    left: leftAnd,
    right: rightAnd,
    shortCircuited: rightAnd === undefined,
  };
}
