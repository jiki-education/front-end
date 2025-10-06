import type { Executor } from "../executor";
import type { DictionaryExpression } from "../expression";
import type { EvaluationResultDictionaryExpression } from "../evaluation-result";
import * as Jiki from "../jikiObjects";

export function executeDictionaryExpression(
  executor: Executor,
  expression: DictionaryExpression
): EvaluationResultDictionaryExpression {
  let records: Map<string, any> = new Map();

  for (const [key, value] of expression.elements.entries()) {
    const evalRes = executor.evaluate(value);
    records.set(key, evalRes.jikiObject);
  }
  const jikiObject = new Jiki.Dictionary(records);
  return {
    type: "DictionaryExpression",
    jikiObject: jikiObject,
    immutableJikiObject: jikiObject.clone(),
  };
}
