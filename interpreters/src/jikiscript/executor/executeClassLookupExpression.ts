import type { Executor } from "../executor";
import type { ClassLookupExpression } from "../expression";
import type { EvaluationResultClassLookupExpression } from "../evaluation-result";
import * as Jiki from "../jikiObjects";

export function executeClassLookupExpression(
  executor: Executor,
  expression: ClassLookupExpression
): EvaluationResultClassLookupExpression {
  const klass = executor.lookupClass(expression.name);

  const jikiObject = new Jiki.Boolean(true);
  return {
    type: "ClassLookupExpression",
    name: expression.name.lexeme,
    class: klass,
    jikiObject: jikiObject,
    immutableJikiObject: jikiObject.clone(),
  };
}
