import type { Executor } from "../executor";
import type { ListExpression } from "../expression";
import type { EvaluationResultListExpression } from "../evaluation-result";
import type { JikiObject } from "../jikiObjects";
import { PyList } from "../jikiObjects";

export function executeListExpression(executor: Executor, expression: ListExpression): EvaluationResultListExpression {
  // Evaluate each element of the list
  const elements: JikiObject[] = [];

  for (const element of expression.elements) {
    const evaluatedElement = executor.evaluate(element);
    elements.push(evaluatedElement.jikiObject);
  }

  // Create the PyList with evaluated elements
  const result = new PyList(elements);

  return {
    type: "ListExpression",
    jikiObject: result,
    immutableJikiObject: result.clone(),
  };
}
