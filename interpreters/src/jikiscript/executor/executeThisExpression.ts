import type { Executor } from "../executor";
import type { ThisExpression } from "../expression";
import type { EvaluationResultThisExpression } from "../evaluation-result";

export function executeThisExpression(executor: Executor, expression: ThisExpression): EvaluationResultThisExpression {
  if (!executor.contextualThis) {
    executor.error("ThisKeywordUsedOutsideOfMethodContext", expression.location);
  }

  return {
    type: "ThisExpression",
    jikiObject: executor.contextualThis,
    // contextualThis can be null outside of class methods
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    immutableJikiObject: executor.contextualThis?.clone(),
  };
}
