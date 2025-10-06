import type { EvaluationResultTemplateLiteralExpression } from "../executor/executeTemplateLiteralExpression";
import type { TemplateLiteralExpression } from "../expression";
import type { DescriptionContext } from "../../shared/frames";
import { describeExpression } from "./describeSteps";
import { unwrapJSObject } from "../jikiObjects";

export function describeTemplateLiteralExpression(
  expression: TemplateLiteralExpression,
  result: EvaluationResultTemplateLiteralExpression,
  context: DescriptionContext
): string[] {
  const steps: string[] = [];

  // Describe evaluating each interpolated expression
  for (let i = 0; i < expression.parts.length; i++) {
    const part = expression.parts[i];
    const evaluatedPart = result.parts[i];

    if (typeof part !== "string" && typeof evaluatedPart !== "string") {
      // It's an interpolated expression
      const partSteps = describeExpression(part, evaluatedPart, context);
      steps.push(...partSteps);
    }
  }

  // Describe combining the parts into the final string
  const finalValue = unwrapJSObject(result.immutableJikiObject);
  const valueStr = typeof finalValue === "string" ? `"${finalValue}"` : String(finalValue);
  steps.push(`Combined the template parts into ${valueStr}.`);

  return steps;
}
