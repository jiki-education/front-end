import type { Executor } from "../executor";
import { MemberExpression } from "../expression";
import type { AssignmentExpression } from "../expression";
import type { EvaluationResultAssignmentExpression } from "../evaluation-result";
import { JSArray, JSDictionary, JSString, JSNumber } from "../jikiObjects";

export function executeAssignmentExpression(
  executor: Executor,
  expression: AssignmentExpression
): EvaluationResultAssignmentExpression {
  const valueResult = executor.evaluate(expression.value);

  // Handle member expression assignment (e.g., arr[0] = value or obj.prop = value)
  if (expression.target instanceof MemberExpression) {
    const memberExpr = expression.target;

    // Evaluate the object (which could be a nested MemberExpression)
    const objectResult = executor.evaluate(memberExpr.object);
    const object = objectResult.jikiObject;

    // Handle dictionary/object property assignment
    if (object instanceof JSDictionary) {
      // Evaluate the property
      const propertyResult = executor.evaluate(memberExpr.property);
      const property = propertyResult.jikiObject;

      // Convert property to string key (JavaScript semantics)
      let key: string;
      if (property instanceof JSString) {
        key = property.value;
      } else if (property instanceof JSNumber) {
        key = property.value.toString();
      } else {
        // In JavaScript, any value can be used as a property key and will be converted to string
        key = property.toString();
      }

      // Set the property in the dictionary
      object.setProperty(key, valueResult.jikiObject);

      return {
        type: "AssignmentExpression",
        name: memberExpr.computed ? `["${key}"]` : `.${key}`,
        value: valueResult,
        jikiObject: valueResult.jikiObject,
        immutableJikiObject: valueResult.jikiObject.clone(),
      };
    }

    // Handle array element assignment
    if (object instanceof JSArray) {
      const array = object;

      // Evaluate the index
      const indexResult = executor.evaluate(memberExpr.property);

      // Check if index is a number
      if (typeof indexResult.jikiObject.value !== "number") {
        executor.error("TypeError", memberExpr.property.location, {
          message: "Array index must be a number",
        });
      }

      const index = indexResult.jikiObject.value;

      // Check if index is an integer
      if (!Number.isInteger(index)) {
        executor.error("TypeError", memberExpr.property.location, {
          message: "Array index must be an integer",
        });
      }

      // Handle negative indices - in JavaScript, they don't wrap around, they extend the array
      if (index < 0) {
        // In JavaScript, arr[-1] = value sets a property "-1", not the last element
        // For now, we'll throw an error to match our educational goals
        executor.error("IndexOutOfRange", memberExpr.property.location, {
          index: index,
          length: array.length,
        });
      }

      // Extend array if necessary (JavaScript behavior)
      // Just set the element at the index - JavaScript will handle sparse arrays
      // No need to fill with undefined values
      array.setElement(index, valueResult.jikiObject);

      return {
        type: "AssignmentExpression",
        name: `[${index}]`,
        value: valueResult,
        jikiObject: valueResult.jikiObject,
        immutableJikiObject: valueResult.jikiObject.clone(),
      };
    }

    // Error: trying to set property on non-object/non-array
    executor.error("TypeError", memberExpr.object.location, {
      message: `Cannot set property of ${object.type}`,
    });
  }

  // Handle regular identifier assignment
  const target = expression.target;
  const success = executor.environment.update(target.lexeme, valueResult.jikiObject);

  if (!success) {
    executor.error("VariableNotDeclared", target.location, {
      name: target.lexeme,
    });
  }

  return {
    type: "AssignmentExpression",
    name: target.lexeme,
    value: valueResult,
    jikiObject: valueResult.jikiObject,
    immutableJikiObject: valueResult.jikiObject.clone(),
  };
}
