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
    const name = expression.name.lexeme;
    const suggestion = executor.suggestSimilarName(name, "variable");
    if (suggestion !== null) {
      executor.error("VariableNotDeclaredWithSimilarNameSuggestion", expression.location, { name, suggestion });
    }
    executor.error("VariableNotDeclared", expression.location, { name });
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
