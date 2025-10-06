import type { EvaluationResultDictionaryExpression } from "../evaluation-result";
import type { DictionaryExpression } from "../expression";
import { JSDictionary } from "../jikiObjects";
import { formatJSObject } from "../helpers";

export function describeDictionaryExpression(
  result: EvaluationResultDictionaryExpression,
  _expression: DictionaryExpression,
  _executor: any
): string[] {
  const dictionary = result.immutableJikiObject;

  if (!(dictionary instanceof JSDictionary)) {
    return ["<li>Created an object.</li>"];
  }

  const size = dictionary.value.size;

  if (size === 0) {
    return ["<li>Created an empty object <code>{}</code>.</li>"];
  }

  const formatted = formatJSObject(dictionary);
  return [`<li>Created an object <code>${formatted}</code>.</li>`];
}
