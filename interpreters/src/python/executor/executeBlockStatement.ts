import type { Executor } from "../executor";
import type { BlockStatement } from "../statement";
import type { EvaluationResult } from "../evaluation-result";

export function executeBlockStatement(executor: Executor, statement: BlockStatement): EvaluationResult | null {
  // Execute each statement in the block
  let lastResult: EvaluationResult | null = null;

  for (const stmt of statement.statements) {
    lastResult = executor.executeStatement(stmt);
  }

  // Return the result of the last statement (or null if no statements produced values)
  // In Python, blocks don't produce values themselves - only expressions and certain statements do
  return lastResult;
}
