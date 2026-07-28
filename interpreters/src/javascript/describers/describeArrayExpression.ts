import type { ArrayExpression } from "../expression";
import type { EvaluationResultArrayExpression } from "../evaluation-result";
import type { DescriptionContext } from "./types";

export function describeArrayExpression(
  _expression: ArrayExpression,
  _result: EvaluationResultArrayExpression,
  _context: DescriptionContext
): string[] {
  return [];
}
