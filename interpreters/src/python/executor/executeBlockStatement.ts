import type { Executor } from "../executor";
import type { BlockStatement } from "../statement";
import type { EvaluationResult, EvaluationResultBlockStatement } from "../evaluation-result";
import { PyNone } from "../jikiObjects";

export function executeBlockStatement(executor: Executor, statement: BlockStatement): EvaluationResult {
  // Execute each statement in the block
  let lastResult: EvaluationResult | null = null;

  for (const stmt of statement.statements) {
    lastResult = executor.executeStatement(stmt);

    // If we got a result, use it. If null, continue.
    if (lastResult) {
      // In Python, blocks don't have specific error handling - errors propagate up
    }
  }

  // If no statements were executed, return PyNone
  if (!lastResult) {
    const noneObj = new PyNone();
    const result: EvaluationResultBlockStatement = {
      type: "BlockStatement",
      jikiObject: noneObj,
      immutableJikiObject: noneObj.clone(),
    };
    return result;
  }

  // Return the result of the last statement
  // Note: Break/continue statements have undefined jikiObject, so we fall back to PyNone
  const jikiObject = lastResult.jikiObject ?? new PyNone();
  const result: EvaluationResultBlockStatement = {
    type: "BlockStatement",
    jikiObject: jikiObject,
    immutableJikiObject: lastResult.immutableJikiObject ?? jikiObject.clone(),
  };
  return result;
}
