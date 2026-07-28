import type { EvaluationResultDictionaryExpression } from "../evaluation-result";
import type { DictionaryExpression } from "../expression";
import type { DescriptionContext } from "./types";

export function describeDictionaryExpression(
  _result: EvaluationResultDictionaryExpression,
  _expression: DictionaryExpression,
  _context: DescriptionContext
): string[] {
  return [];
}
