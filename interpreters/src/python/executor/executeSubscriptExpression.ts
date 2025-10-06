import type { Executor } from "../executor";
import type { SubscriptExpression } from "../expression";
import type { EvaluationResultSubscriptExpression } from "../evaluation-result";
import { PyList, PyNumber, PyNone } from "../jikiObjects";

export function executeSubscriptExpression(
  executor: Executor,
  expression: SubscriptExpression
): EvaluationResultSubscriptExpression {
  // Evaluate the object (should be a list for now)
  const objectResult = executor.evaluate(expression.object);
  const object = objectResult.jikiObject;

  // Evaluate the index
  const indexResult = executor.evaluate(expression.index);
  const index = indexResult.jikiObject;

  // For now, we only support list subscripting
  if (!(object instanceof PyList)) {
    const typeName = (object as any).pythonTypeName ? (object as any).pythonTypeName() : object.type;
    executor.error("TypeError", expression.location, {
      message: `'subscript' not supported for type '${typeName}'`,
    });
  }

  // Check that the index is a number
  if (!(index instanceof PyNumber)) {
    const typeName = (index as any).pythonTypeName ? (index as any).pythonTypeName() : index.type;
    executor.error("TypeError", expression.location, {
      message: `list indices must be integers, not ${typeName}`,
    });
  }

  // Check for non-integer indices
  if (!index.isInteger()) {
    executor.error("TypeError", expression.location, {
      message: `list indices must be integers, not float`,
    });
  }

  let actualIndex = index.value;
  const listLength = object.length;

  // Handle negative indexing (Python feature)
  if (actualIndex < 0) {
    actualIndex = listLength + actualIndex;
  }

  // Check bounds
  if (actualIndex < 0 || actualIndex >= listLength) {
    executor.error("IndexError", expression.location, {
      index: index.value,
    });
  }

  // Get the element
  const element = object.getElement(actualIndex);

  return {
    type: "SubscriptExpression",
    object: objectResult,
    index: indexResult,
    jikiObject: element || new PyNone(),
    immutableJikiObject: element ? element.clone() : new PyNone(),
  };
}
