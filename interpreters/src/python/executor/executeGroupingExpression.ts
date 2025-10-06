import type { Executor } from "../executor";
import type { GroupingExpression } from "../expression";
import type { EvaluationResult } from "../evaluation-result";

export function executeGroupingExpression(executor: Executor, expression: GroupingExpression): EvaluationResult {
  const result = executor.evaluate(expression.inner);

  return {
    type: "GroupingExpression",
    expression: result,
    jikiObject: result.jikiObject,
    immutableJikiObject: result.jikiObject.clone(),
  } as any;
}
