import type { Executor } from "../executor";
import type { FunctionDeclaration } from "../statement";
import { JSUserDefinedFunction } from "../functions";

export function executeFunctionDeclaration(executor: Executor, statement: FunctionDeclaration): void {
  if (executor.isProtectedName(statement.name.lexeme)) {
    executor.error("FunctionAlreadyDefined", statement.name.location, { name: statement.name.lexeme });
  }

  const func = new JSUserDefinedFunction(statement, executor.environment);
  executor.defineVariable(statement.name.lexeme, func, statement.name.location);
}
