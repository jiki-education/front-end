import type { EvaluationResultExpression, EvaluationResultMemberExpression } from "../evaluation-result";
import { type Executor, RuntimeError } from "../executor";
import type { MemberExpression } from "../expression";
import { type JSString, JSNumber, JSString as JSStringClass, JSUndefined } from "../jsObjects";
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
      throw new RuntimeError(
        `TypeError: message: Cannot use computed property access for stdlib members`,
        expression.location,
        "TypeError",
        { message: "Cannot use computed property access for stdlib members" }
      );
    }
    // If it's a string that doesn't match stdlib, it's still an error for strings
    throw new RuntimeError(`TypeError: message: String indices must be numbers`, expression.location, "TypeError", {
      message: "String indices must be numbers",
    });
  }

  // Check that the property is a number
  if (!(property instanceof JSNumber)) {
    throw new RuntimeError(`TypeError: message: String indices must be numbers`, expression.location, "TypeError", {
      message: "String indices must be numbers",
    });
  }

  const index = property.value;

  // Check for negative indices
  if (index < 0) {
    throw new RuntimeError(
      `IndexOutOfRange: index: ${index}: length: ${str.value.length}`,
      expression.location,
      "IndexOutOfRange",
      { index: index, length: str.value.length }
    );
  }

  // Check bounds - in JavaScript, reading out of bounds returns undefined
  if (index >= str.value.length) {
    return {
      type: "MemberExpression",
      object: objectResult,
      property: propertyResult,
      jikiObject: new JSUndefined(),
      immutableJikiObject: new JSUndefined(),
    };
  }

  // Check for non-integer indices
  if (!Number.isInteger(index)) {
    throw new RuntimeError(`TypeError: message: String indices must be integers`, expression.location, "TypeError", {
      message: "String indices must be integers",
    });
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
