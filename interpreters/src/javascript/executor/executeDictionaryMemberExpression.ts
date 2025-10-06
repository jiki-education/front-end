import type { EvaluationResultExpression, EvaluationResultMemberExpression } from "../evaluation-result";
import type { Executor } from "../executor";
import type { MemberExpression } from "../expression";
import { type JSDictionary, JSString, JSNumber, JSUndefined } from "../jsObjects";

// Type-specific handler for dictionaries
export function executeDictionaryMemberExpression(
  executor: Executor,
  expression: MemberExpression,
  objectResult: EvaluationResultExpression,
  dictionary: JSDictionary
): EvaluationResultMemberExpression {
  // For both computed and non-computed access, evaluate the property
  const propertyResult = executor.evaluate(expression.property);
  const property = propertyResult.jikiObject;

  // Convert property to string key
  let key: string;
  if (property instanceof JSString) {
    key = property.value;
  } else if (property instanceof JSNumber) {
    key = property.value.toString();
  } else {
    // In JavaScript, any value can be used as a property key and will be converted to string
    key = property.toString();
  }

  // Get the value from the dictionary
  const value = dictionary.getProperty(key);

  return {
    type: "MemberExpression",
    object: objectResult,
    property: propertyResult,
    jikiObject: value || new JSUndefined(),
    immutableJikiObject: value ? value.clone() : new JSUndefined(),
  };
}
