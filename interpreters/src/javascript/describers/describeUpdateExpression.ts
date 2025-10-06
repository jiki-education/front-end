import type { UpdateExpression } from "../expression";
import type { EvaluationResult } from "../evaluation-result";
import { codeTag } from "../helpers";

export function describeUpdateExpression(expression: UpdateExpression, result: EvaluationResult): string {
  const varName = codeTag(expression.operand.name.lexeme, expression.operand.location);
  const operator = expression.operator.type === "INCREMENT" ? "incremented" : "decremented";
  const oldValue = expression.prefix
    ? result.immutableJikiObject.value - (expression.operator.type === "INCREMENT" ? 1 : -1)
    : result.immutableJikiObject.value;
  const newValue = expression.prefix
    ? result.immutableJikiObject.value
    : result.immutableJikiObject.value + (expression.operator.type === "INCREMENT" ? 1 : -1);

  if (expression.prefix) {
    return `The variable ${varName} was ${operator} from ${codeTag(oldValue, expression.location)} to ${codeTag(newValue, expression.location)}. The expression evaluated to ${codeTag(newValue, expression.location)}.`;
  }
  return `The variable ${varName} was ${operator} from ${codeTag(oldValue, expression.location)} to ${codeTag(newValue, expression.location)}. The expression evaluated to ${codeTag(oldValue, expression.location)} (the value before the update).`;
}
