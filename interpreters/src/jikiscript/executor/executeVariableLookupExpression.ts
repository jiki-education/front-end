import type { Executor } from "../executor";
import type { VariableLookupExpression } from "../expression";
import type { EvaluationResultVariableLookupExpression } from "../evaluation-result";
import * as Jiki from "../jikiObjects";

export function executeVariableLookupExpression(
  executor: Executor,
  expression: VariableLookupExpression
): EvaluationResultVariableLookupExpression {
  const value = executor.lookupVariable(expression.name);
  executor.guardUncalledFunction(value, expression);
  if (value instanceof Jiki.Class) {
    executor.error("ClassCannotBeUsedAsVariableReference", expression.name.location, {
      name: expression.name.lexeme,
    });
  }

  return {
    type: "VariableLookupExpression",
    name: expression.name.lexeme,
    jikiObject: value,
    immutableJikiObject: value.clone(),
  };
}
