import type { Executor } from "../executor";
import type { CalleeIdentifierExpression } from "../expression";
import type { EvaluationResultIdentifierExpression } from "../evaluation-result";

export function executeCalleeIdentifierExpression(
  executor: Executor,
  expression: CalleeIdentifierExpression
): EvaluationResultIdentifierExpression {
  const value = executor.environment.get(expression.name.lexeme);

  if (value === undefined) {
    executor.error("FunctionNotFound", expression.location, { name: expression.name.lexeme });
  }

  return {
    type: "IdentifierExpression",
    name: expression.name.lexeme,
    jikiObject: value,
    immutableJikiObject: value.clone(),
  };
}
