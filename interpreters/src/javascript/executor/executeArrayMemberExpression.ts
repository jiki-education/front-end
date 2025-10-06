import type { EvaluationResultExpression, EvaluationResultMemberExpression } from "../evaluation-result";
import { type Executor, RuntimeError } from "../executor";
import type { MemberExpression } from "../expression";
import { type JSArray, JSNumber, JSString, JSUndefined } from "../jsObjects";
import { executeStdlibMemberExpression } from "./executeStdlibMemberExpression";
import { stdlib } from "../stdlib";

// Type-specific handler for arrays
export function executeArrayMemberExpression(
  executor: Executor,
  expression: MemberExpression,
  objectResult: EvaluationResultExpression,
  array: JSArray
): EvaluationResultMemberExpression {
  // Check if this is a non-computed access (property/method access like arr.length)
  if (!expression.computed) {
    // For dot notation, delegate to stdlib resolution
    return executeStdlibMemberExpression(executor, expression, objectResult, array);
  }

  // For computed access (bracket notation) - check what we're accessing
  const propertyResult = executor.evaluate(expression.property);
  const property = propertyResult.jikiObject;

  // Check if this is trying to access a stdlib member via computed access
  if (property instanceof JSString) {
    const propertyName = property.value;
    // Check if this string matches any stdlib property or method for arrays
    const hasStdlibProperty = propertyName in stdlib.array.properties;
    const hasStdlibMethod = propertyName in stdlib.array.methods;
    if (hasStdlibProperty || hasStdlibMethod) {
      // Throw error - stdlib members cannot be accessed via computed notation
      throw new RuntimeError(
        `TypeError: message: Cannot use computed property access for stdlib members`,
        expression.location,
        "TypeError",
        { message: "Cannot use computed property access for stdlib members" }
      );
    }
    // If it's a string that doesn't match stdlib, it's still an error for arrays
    throw new RuntimeError(`TypeError: message: Array indices must be numbers`, expression.location, "TypeError", {
      message: "Array indices must be numbers",
    });
  }

  // Check that the property is a number
  if (!(property instanceof JSNumber)) {
    throw new RuntimeError(`TypeError: message: Array indices must be numbers`, expression.location, "TypeError", {
      message: "Array indices must be numbers",
    });
  }

  const index = property.value;

  // Check for negative indices (JavaScript doesn't support them natively)
  if (index < 0) {
    throw new RuntimeError(
      `IndexOutOfRange: index: ${index}: length: ${array.length}`,
      expression.location,
      "IndexOutOfRange",
      { index: index, length: array.length }
    );
  }

  // Check bounds - in JavaScript, reading out of bounds returns undefined
  if (index >= array.length) {
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
    throw new RuntimeError(`TypeError: message: Array indices must be integers`, expression.location, "TypeError", {
      message: "Array indices must be integers",
    });
  }

  // Get the element
  const element = array.getElement(index);

  return {
    type: "MemberExpression",
    object: objectResult,
    property: propertyResult,
    jikiObject: element || new JSUndefined(),
    immutableJikiObject: element ? element.clone() : new JSUndefined(),
  };
}
