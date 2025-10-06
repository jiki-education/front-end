import type { Executor } from "../executor";
import type { BlockStatement } from "../statement";
import type { EvaluationResult } from "../evaluation-result";
import { Environment } from "../environment";

export function executeBlockStatement(executor: Executor, statement: BlockStatement): EvaluationResult {
  // Create a new environment with the current environment as the enclosing scope
  const blockEnvironment = new Environment(executor.languageFeatures, executor.environment);
  executor.executeBlock(statement.statements, blockEnvironment);

  return {
    type: "BlockStatement",
    statements: statement.statements,
  } as any;
}
