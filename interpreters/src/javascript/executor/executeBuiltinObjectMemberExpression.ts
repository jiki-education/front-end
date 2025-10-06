import type { EvaluationResultExpression, EvaluationResultMemberExpression } from "../evaluation-result";
import type { Executor } from "../executor";
import { RuntimeError } from "../executor";
import type { MemberExpression } from "../expression";
import { type JSBuiltinObject, JSString } from "../jsObjects";

// Type-specific handler for builtin objects (console, Math, etc.)
export function executeBuiltinObjectMemberExpression(
  executor: Executor,
  expression: MemberExpression,
  objectResult: EvaluationResultExpression,
  builtinObject: JSBuiltinObject
): EvaluationResultMemberExpression {
  // Builtin objects only support dot notation (non-computed access)
  if (expression.computed) {
    throw new RuntimeError(
      `TypeError: Cannot use computed access on builtin objects`,
      expression.location,
      "TypeError",
      {}
    );
  }

  // Property must be an identifier when using dot notation
  const propertyResult = executor.evaluate(expression.property);
  const property = propertyResult.jikiObject;

  // Guard: property must be a string for builtin object access
  if (!(property instanceof JSString)) {
    throw new RuntimeError(
      `TypeError: Builtin object property must be a string`,
      expression.property.location,
      "TypeError",
      {}
    );
  }

  const methodName = property.value;

  // Get the method from the builtin object
  const method = builtinObject.getMethod(methodName);

  if (!method) {
    throw new RuntimeError(
      `PropertyNotFound: property: ${methodName}`,
      expression.property.location,
      "PropertyNotFound",
      { property: methodName }
    );
  }

  return {
    type: "MemberExpression",
    object: objectResult,
    property: propertyResult,
    jikiObject: method,
    immutableJikiObject: method.clone(),
  };
}
