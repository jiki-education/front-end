import type { Executor } from "../executor";
import type { MemberExpression } from "../expression";
import type { EvaluationResultMemberExpression } from "../evaluation-result";
import type { JSArray, JSDictionary, JSBuiltinObject } from "../jikiObjects";
import { executeStdlibMemberExpression } from "./executeStdlibMemberExpression";
import { executeDictionaryMemberExpression } from "./executeDictionaryMemberExpression";
import { executeArrayMemberExpression } from "./executeArrayMemberExpression";
import { executeBuiltinObjectMemberExpression } from "./executeBuiltinObjectMemberExpression";

// Main entry point - dispatches to type-specific handlers
export function executeMemberExpression(
  executor: Executor,
  expression: MemberExpression
): EvaluationResultMemberExpression {
  // Evaluate the object
  const objectResult = executor.evaluate(expression.object);
  const object = objectResult.jikiObject;

  // Dispatch based on object type
  switch (object.type) {
    case "list":
      return executeArrayMemberExpression(executor, expression, objectResult, object as JSArray);

    case "dictionary":
      return executeDictionaryMemberExpression(executor, expression, objectResult, object as JSDictionary);

    case "builtin-object":
      return executeBuiltinObjectMemberExpression(executor, expression, objectResult, object as JSBuiltinObject);

    default:
      // For all other types (string, number, etc.), check stdlib
      return executeStdlibMemberExpression(executor, expression, objectResult, object);
  }
}
