import type { EvaluationResultExpression, EvaluationResultMemberExpression } from "../evaluation-result";
import type { Executor } from "../executor";
import type { MemberExpression } from "../expression";
import { type JSBuiltinObject, JSString } from "../jsObjects";
import { InterpreterInternalError } from "../error";

// Type-specific handler for builtin objects (console, Math, etc.)
export function executeBuiltinObjectMemberExpression(
  executor: Executor,
  expression: MemberExpression,
  objectResult: EvaluationResultExpression,
  builtinObject: JSBuiltinObject
): EvaluationResultMemberExpression {
  // Builtin objects only support dot notation (non-computed access)
  if (expression.computed) {
    executor.error("ComputedAccessNotAllowedForBuiltin", expression.location);
  }

  // Property must be an identifier when using dot notation
  const propertyResult = executor.evaluate(expression.property);
  const property = propertyResult.jikiObject;

  // Guard: property must be a string. Computed access is already rejected above
  // and dot access always yields a string identifier, so this can't happen from
  // student code - it's an interpreter invariant.
  if (!(property instanceof JSString)) {
    throw new InterpreterInternalError("Builtin object property was not a string");
  }

  const methodName = property.value;

  // Get the method from the builtin object
  const method = builtinObject.getMethod(methodName);

  if (!method) {
    executor.error("PropertyNotFound", expression.property.location, {
      property: methodName,
      type: builtinObject.name,
    });
  }

  return {
    type: "MemberExpression",
    object: objectResult,
    property: propertyResult,
    jikiObject: method,
    immutableJikiObject: method.clone(),
  };
}
