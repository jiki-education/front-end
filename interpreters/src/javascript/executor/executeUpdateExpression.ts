import type { Executor } from "../executor";
import type { UpdateExpression } from "../expression";
import type { EvaluationResultUpdateExpression } from "../evaluation-result";
import { JSNumber } from "../jikiObjects";

export function executeUpdateExpression(
  executor: Executor,
  expression: UpdateExpression
): EvaluationResultUpdateExpression {
  // Get the current value of the variable
  const currentValue = executor.environment.get(expression.operand.name.lexeme);

  if (currentValue === undefined) {
    executor.error("VariableNotDeclared", expression.location, { name: expression.operand.name.lexeme });
  }

  if (!(currentValue instanceof JSNumber)) {
    executor.error("InvalidUnaryExpression", expression.location, {
      operator: expression.operator.lexeme,
      type: currentValue.type,
    });
  }

  // Calculate the new value
  const increment = expression.operator.type === "INCREMENT" ? 1 : -1;
  const newValue = new JSNumber(currentValue.value + increment);

  // Update the variable
  executor.environment.update(expression.operand.name.lexeme, newValue, expression.operand.name.location);

  // Return the appropriate value based on prefix/postfix
  if (expression.prefix) {
    // Prefix: return the new value
    return {
      type: "UpdateExpression",
      jikiObject: newValue,
      immutableJikiObject: newValue.clone(),
    };
  }
  // Postfix: return the old value
  return {
    type: "UpdateExpression",
    jikiObject: currentValue,
    immutableJikiObject: currentValue.clone(),
  };
}
