import type { Executor } from "../executor";
import type { GroupingExpression } from "../expression";
import type { EvaluationResultGroupingExpression } from "../evaluation-result";

export function executeGroupingExpression(
  executor: Executor,
  expression: GroupingExpression
): EvaluationResultGroupingExpression {
  const result = executor.evaluate(expression.inner);

  return {
    type: "GroupingExpression",
    inner: result,
    jikiObject: result.jikiObject,
    immutableJikiObject: result.jikiObject.clone(),
  };
}
