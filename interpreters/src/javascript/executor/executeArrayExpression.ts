import type { Executor } from "../executor";
import type { ArrayExpression } from "../expression";
import type { EvaluationResultArrayExpression } from "../evaluation-result";
import { JSArray } from "../jikiObjects";

export function executeArrayExpression(
  executor: Executor,
  expression: ArrayExpression
): EvaluationResultArrayExpression {
  const elements = expression.elements.map(element => executor.evaluate(element).jikiObject);
  const jikiObject = new JSArray(elements);

  return {
    type: "ArrayExpression",
    jikiObject: jikiObject,
    immutableJikiObject: jikiObject.clone(),
  };
}
