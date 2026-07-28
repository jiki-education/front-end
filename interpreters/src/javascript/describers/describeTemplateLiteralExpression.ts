import type { EvaluationResultTemplateLiteralExpression } from "../evaluation-result";
import type { TemplateLiteralExpression } from "../expression";
import type { DescriptionContext } from "./types";
import { describeExpression } from "./describeSteps";

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

  return steps;
}
