import type { Executor } from "../executor";
import type { ExpressionStatement } from "../statement";
import type { EvaluationResultExpressionStatement } from "../evaluation-result";

export function executeExpressionStatement(
  executor: Executor,
  statement: ExpressionStatement
): EvaluationResultExpressionStatement {
  const expressionResult = executor.evaluate(statement.expression);
  return {
    type: "ExpressionStatement",
    expression: expressionResult,
    jikiObject: expressionResult.jikiObject,
    immutableJikiObject: expressionResult.jikiObject.clone(),
  };
}
