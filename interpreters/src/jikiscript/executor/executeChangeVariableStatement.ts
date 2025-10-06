import type { Executor } from "../executor";
import { isCallable } from "../functions";
import { RuntimeError } from "../error";
import type { ChangeVariableStatement } from "../statement";
import type { EvaluationResultChangeVariableStatement } from "../evaluation-result";
import * as Jiki from "../jikiObjects";

export function executeChangeVariableStatement(executor: Executor, statement: ChangeVariableStatement): void {
  executor.executeFrame<EvaluationResultChangeVariableStatement>(statement, () => {
    // Ensure the variable exists
    const variable = executor.lookupVariable(statement.name);

    if (isCallable(executor.getVariable(statement.name))) {
      executor.error("UnexpectedChangeOfFunctionReference", statement.name.location, {
        name: statement.name.lexeme,
      });
    }

    let value;
    try {
      value = executor.evaluate(statement.value);
    } catch (e) {
      if (e instanceof RuntimeError && e.type === "ExpressionEvaluatedToNullValue") {
        executor.error("StateErrorCannotStoreNullValueFromFunction", statement.value.location);
      } else {
        throw e;
      }
    }

    // Update the underlying value
    const oldValue = Jiki.unwrapJikiObject(variable.value);
    executor.updateVariable(statement.name, value.jikiObject);

    return {
      type: "ChangeVariableStatement",
      name: statement.name.lexeme,
      value: value,
      oldValue,
    };
  });
}
