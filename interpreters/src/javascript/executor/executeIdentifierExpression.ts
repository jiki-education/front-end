import type { Executor } from "../executor";
import type { IdentifierExpression } from "../expression";
import type { EvaluationResultIdentifierExpression } from "../evaluation-result";
import { isCallable } from "../functions";

export function executeIdentifierExpression(
  executor: Executor,
  expression: IdentifierExpression
): EvaluationResultIdentifierExpression {
  const value = executor.environment.get(expression.name.lexeme);

  if (value === undefined) {
    executor.error("VariableNotDeclared", expression.location, { name: expression.name.lexeme });
  }

  if (isCallable(value)) {
    executor.error("UnexpectedUncalledFunction", expression.location, { name: expression.name.lexeme });
  }

  return {
    type: "IdentifierExpression",
    name: expression.name.lexeme,
    jikiObject: value,
    immutableJikiObject: value.clone(),
  };
}
