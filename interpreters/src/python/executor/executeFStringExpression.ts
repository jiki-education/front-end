import type { Executor } from "../executor";
import type { FStringExpression } from "../expression";
import type { EvaluationResultFStringExpression, EvaluationResultExpression } from "../evaluation-result";
import { PyString } from "../jikiObjects";

export function executeFStringExpression(
  executor: Executor,
  expression: FStringExpression
): EvaluationResultFStringExpression {
  let result = "";
  const evaluatedParts: (string | EvaluationResultExpression)[] = [];

  for (const part of expression.parts) {
    if (typeof part === "string") {
      // It's a literal string part
      result += part;
      evaluatedParts.push(part);
    } else {
      // It's an interpolated expression
      const evaluationResult = executor.evaluate(part);
      // Convert to string using Python's str() method (via toString())
      result += evaluationResult.jikiObject.toString();
      evaluatedParts.push(evaluationResult);
    }
  }

  const jikiObject = new PyString(result);
  return {
    type: "FStringExpression",
    parts: evaluatedParts,
    jikiObject: jikiObject,
    immutableJikiObject: jikiObject.clone(),
  };
}
