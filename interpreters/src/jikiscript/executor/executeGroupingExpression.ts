import type { Executor } from "../executor";
import type { GroupingExpression } from "../expression";
import type { EvaluationResultGroupingExpression } from "../evaluation-result";

export function executeGroupingExpression(
  executor: Executor,
  expression: GroupingExpression
): EvaluationResultGroupingExpression {
  const inner = executor.evaluate(expression.inner);

  return {
    type: "GroupingExpression",
    jikiObject: inner.jikiObject,
    // jikiObject can be undefined for statements without values
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    immutableJikiObject: inner.jikiObject?.clone(),
    inner,
  };
}
