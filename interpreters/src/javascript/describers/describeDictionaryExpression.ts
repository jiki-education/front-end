import type { EvaluationResultDictionaryExpression } from "../evaluation-result";
import type { DictionaryExpression } from "../expression";
import type { DescriptionContext } from "./types";
import { JSDictionary } from "../jikiObjects";
import { formatJSObject } from "../helpers";

export function describeDictionaryExpression(
  result: EvaluationResultDictionaryExpression,
  _expression: DictionaryExpression,
  context: DescriptionContext
): string[] {
  const dictionary = result.immutableJikiObject;

  if (!(dictionary instanceof JSDictionary)) {
    return [context.t("description.dictionaryExpression.notObject")];
  }

  const size = dictionary.value.size;

  if (size === 0) {
    return [context.t("description.dictionaryExpression.empty")];
  }

  const formatted = formatJSObject(dictionary);
  return [context.t("description.dictionaryExpression.created", { formatted })];
}
