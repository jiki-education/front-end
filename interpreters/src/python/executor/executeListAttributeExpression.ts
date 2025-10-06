import type { EvaluationResultExpression, EvaluationResultAttributeExpression } from "../evaluation-result";
import type { Executor } from "../executor";
import type { AttributeExpression } from "../expression";
import type { PyList } from "../jikiObjects";
import { executeStdlibAttributeExpression } from "./executeStdlibAttributeExpression";

// List-specific attribute handling
export function executeListAttributeExpression(
  executor: Executor,
  expression: AttributeExpression,
  objectResult: EvaluationResultExpression,
  object: PyList
): EvaluationResultAttributeExpression {
  // For now, lists only have stdlib members, no special handling needed
  // In the future, we might add list-specific attributes here
  return executeStdlibAttributeExpression(executor, expression, objectResult, object);
}
