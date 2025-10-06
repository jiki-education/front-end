import type { Executor } from "../executor";
import type { BlockStatement } from "../statement";
import { Environment } from "../environment";

export function executeBlockStatement(executor: Executor, statement: BlockStatement): void {
  // Create a new environment with the current environment as the enclosing scope
  const blockEnvironment = new Environment(executor.languageFeatures, executor.environment);
  executor.executeBlock(statement.statements, blockEnvironment);
}
