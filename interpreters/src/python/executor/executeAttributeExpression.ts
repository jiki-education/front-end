import type { Executor } from "../executor";
import type { AttributeExpression } from "../expression";
import type { EvaluationResultAttributeExpression } from "../evaluation-result";
import type { PyList } from "../jikiObjects";
import { executeStdlibAttributeExpression } from "./executeStdlibAttributeExpression";
import { executeListAttributeExpression } from "./executeListAttributeExpression";

// Main entry point - dispatches to type-specific handlers
export function executeAttributeExpression(
  executor: Executor,
  expression: AttributeExpression
): EvaluationResultAttributeExpression {
  // Evaluate the object
  const objectResult = executor.evaluate(expression.object);
  const object = objectResult.jikiObject;

  // Dispatch based on object type
  switch (object.type) {
    case "list":
      return executeListAttributeExpression(executor, expression, objectResult, object as PyList);

    // Future: dictionary, string, etc.
    // case "dictionary":
    //   return executeDictAttributeExpression(executor, expression, objectResult, object as PyDict);

    default:
      // For all other types, check stdlib
      return executeStdlibAttributeExpression(executor, expression, objectResult, object);
  }
}
