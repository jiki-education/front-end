import type { IdentifierExpression } from "../expression";
import type { EvaluationResultIdentifierExpression } from "../evaluation-result";
import type { DescriptionContext } from "./types";
import { codeTag, formatJSObject } from "../helpers";

// Jiki's "box on the shelf" metaphor for a variable read: reading a variable is
// fetching its box off the shelf and taking the value out. Function references
// (a callee identifier) are not variable reads, so they produce no step.
export function describeIdentifierExpression(
  expression: IdentifierExpression,
  result: EvaluationResultIdentifierExpression,
  context: DescriptionContext
): string[] {
  if (result.functionName !== undefined) {
    return [];
  }

  return [
    context.t("description.identifierExpression.lookup", {
      name: codeTag(result.name, expression.location),
      value: codeTag(formatJSObject(result.immutableJikiObject), expression.location),
    }),
  ];
}
