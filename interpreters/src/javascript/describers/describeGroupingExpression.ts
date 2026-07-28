import type { EvaluationResultGroupingExpression } from "../evaluation-result";
import type { GroupingExpression } from "../expression";
import type { DescriptionContext } from "./types";
import { describeExpression } from "./describeSteps";

export function describeGroupingExpression(
  expression: GroupingExpression,
  result: EvaluationResultGroupingExpression,
  context: DescriptionContext
) {
  return describeExpression(expression.inner, result.inner, context);
}
