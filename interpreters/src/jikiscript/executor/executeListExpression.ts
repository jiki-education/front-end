import type { Executor } from "../executor";
import type { ListExpression } from "../expression";
import type { EvaluationResult } from "../evaluation-result";
import * as Jiki from "../jikiObjects";

export function executeListExpression(executor: Executor, expression: ListExpression): EvaluationResult {
  const jikiObject = new Jiki.List(expression.elements.map(element => executor.evaluate(element).jikiObject));
  return {
    type: "ListExpression",
    jikiObject: jikiObject,
    immutableJikiObject: jikiObject.clone(),
  };
}
