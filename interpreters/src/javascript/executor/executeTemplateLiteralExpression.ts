import type { Executor } from "../executor";
import type { TemplateLiteralExpression } from "../expression";
import type { EvaluationResultExpression, EvaluationResultTemplateLiteralExpression } from "../evaluation-result";
import { JSString } from "../jikiObjects";
import { unwrapJSObject } from "../jikiObjects";

export function executeTemplateLiteralExpression(
  executor: Executor,
  expression: TemplateLiteralExpression
): EvaluationResultTemplateLiteralExpression {
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
      const value = unwrapJSObject(evaluationResult.jikiObject);
      // Convert to string (JavaScript template literal behavior)
      result += String(value);
      evaluatedParts.push(evaluationResult);
    }
  }

  return {
    type: "TemplateLiteralExpression",
    parts: evaluatedParts,
    jikiObject: new JSString(result),
    immutableJikiObject: new JSString(result).clone(),
  };
}
