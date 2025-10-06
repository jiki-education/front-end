import type { Executor } from "../executor";
import type { FunctionStatement } from "../statement";
import { UserDefinedFunction } from "../functions";

export function executeFunctionStatement(executor: Executor, statement: FunctionStatement): void {
  const func = new UserDefinedFunction(statement);

  if (!executor.customFunctionDefinitionMode && statement.name.lexeme.includes("#")) {
    executor.error("FunctionCannotBeNamespacedReference", statement.name.location, {
      name: statement.name.lexeme,
    });
  }

  executor.guardDefinedName(statement.name);
  executor.defineVariable(statement.name.lexeme, func);
}
