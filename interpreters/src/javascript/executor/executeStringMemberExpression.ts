import type { EvaluationResultExpression, EvaluationResultMemberExpression } from "../evaluation-result";
import { type Executor } from "../executor";
import type { MemberExpression } from "../expression";
import { type JSString, JSNumber, JSString as JSStringClass } from "../jsObjects";
import { executeStdlibMemberExpression } from "./executeStdlibMemberExpression";
import { stdlib } from "../stdlib";

// Type-specific handler for strings
export function executeStringMemberExpression(
  executor: Executor,
  expression: MemberExpression,
  objectResult: EvaluationResultExpression,
  str: JSString
): EvaluationResultMemberExpression {
  // Check if this is a non-computed access (property/method access like str.length)
  if (!expression.computed) {
    // For dot notation, delegate to stdlib resolution
    return executeStdlibMemberExpression(executor, expression, objectResult, str);
  }

  // For computed access (bracket notation) - check what we're accessing
  const propertyResult = executor.evaluate(expression.property);
  const property = propertyResult.jikiObject;

  // Check if this is trying to access a stdlib member via computed access
  if (property instanceof JSStringClass) {
    const propertyName = property.value;
    const hasStdlibProperty = propertyName in stdlib.string.properties;
    const hasStdlibMethod = propertyName in stdlib.string.methods;
    if (hasStdlibProperty || hasStdlibMethod) {
      executor.error("ComputedAccessNotAllowedForStdlib", expression.location);
    }
    // If it's a string that doesn't match stdlib, it's still an error for strings
    executor.error("StringIndexNotNumber", expression.location);
  }

  // Check that the property is a number
  if (!(property instanceof JSNumber)) {
    executor.error("StringIndexNotNumber", expression.location);
  }

  const index = property.value;

  // Check bounds. Unlike real JS (which returns undefined for out-of-range reads),
  // Jiki treats reading past either end of a string as an error, matching Python
  // (IndexError) and JikiScript (IndexOutOfBounds). undefined almost never appears
  // intentionally in student code, so we surface the mistake where it happens.
  if (index < 0 || index >= str.value.length) {
    executor.error("StringIndexOutOfRange", expression.location, { index: index, length: str.value.length });
  }

  // Check for non-integer indices
  if (!Number.isInteger(index)) {
    executor.error("StringIndexNotInteger", expression.location);
  }

  // Get the character
  const character = new JSStringClass(str.value[index]);

  return {
    type: "MemberExpression",
    object: objectResult,
    property: propertyResult,
    jikiObject: character,
    immutableJikiObject: character.clone(),
  };
}
