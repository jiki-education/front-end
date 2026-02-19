import type { Executor } from "../executor";
import type { FunctionDeclaration } from "../statement";
import { PyUserDefinedFunction } from "../functions";

export function executeFunctionDeclaration(executor: Executor, statement: FunctionDeclaration): void {
  if (executor.isProtectedName(statement.name.lexeme)) {
    executor.error("FunctionAlreadyDefined", statement.name.location, { name: statement.name.lexeme });
  }

  const func = new PyUserDefinedFunction(statement);
  executor.environment.define(statement.name.lexeme, func);
}
