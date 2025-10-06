import type { Executor } from "../executor";
import type { BlockStatement } from "../statement";

export function executeBlockStatement(executor: Executor, statement: BlockStatement): void {
  // Change this to allow scoping
  // executor.executeBlock(statement.statements, new Environment(executor.environment))
  executor.executeBlock(statement.statements, executor.environment);
}
