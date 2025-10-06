import type { Executor } from "../executor";
import type { FunctionDeclaration } from "../statement";
import { PyUserDefinedFunction } from "../functions";

export function executeFunctionDeclaration(executor: Executor, statement: FunctionDeclaration): void {
  const func = new PyUserDefinedFunction(statement);
  executor.environment.define(statement.name.lexeme, func);
}
