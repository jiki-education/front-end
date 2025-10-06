import type { Executor } from "../executor";
import type { FunctionLookupExpression } from "../expression";
import type { EvaluationResultFunctionLookupExpression } from "../evaluation-result";
import * as Jiki from "../jikiObjects";

export function executeFunctionLookupExpression(
  executor: Executor,
  expression: FunctionLookupExpression
): EvaluationResultFunctionLookupExpression {
  const value = executor.lookupFunction(expression.name);
  const jikiObject = new Jiki.Boolean(true);
  return {
    type: "FunctionLookupExpression",
    name: expression.name.lexeme,
    function: value,
    // This is needed so that the null guard doesn't
    // blow up upstream
    jikiObject: jikiObject,
    immutableJikiObject: jikiObject.clone(),
  };
}
