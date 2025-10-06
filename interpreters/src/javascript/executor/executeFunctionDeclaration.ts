import type { Executor } from "../executor";
import type { FunctionDeclaration } from "../statement";
import { JSUserDefinedFunction } from "../functions";

export function executeFunctionDeclaration(executor: Executor, statement: FunctionDeclaration): void {
  const func = new JSUserDefinedFunction(statement);
  executor.defineVariable(statement.name.lexeme, func, statement.name.location);
}
