import type { Executor } from "../executor";
import type { GroupingExpression } from "../expression";
import type { EvaluationResultGroupingExpression } from "../evaluation-result";

export function executeGroupingExpression(
  executor: Executor,
  expression: GroupingExpression
): EvaluationResultGroupingExpression {
  // Grouping expressions simply evaluate their inner expression
  const innerResult = executor.evaluate(expression.inner);

  return {
    type: "GroupingExpression",
    inner: innerResult,
    jikiObject: innerResult.jikiObject,
    immutableJikiObject: innerResult.jikiObject.clone(),
  } as any;
}
