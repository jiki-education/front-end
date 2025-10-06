import type { Executor } from "../executor";
import { RuntimeError } from "../error";
import type { SetPropertyStatement } from "../statement";
import type { EvaluationResultSetPropertyStatement } from "../evaluation-result";

export function executeSetPropertyStatement(executor: Executor, statement: SetPropertyStatement): void {
  executor.executeFrame<EvaluationResultSetPropertyStatement>(statement, () => {
    if (!executor.contextualThis) {
      executor.error("AccessorUsedOnNonInstanceObject", statement.property.location);
    }

    if (executor.contextualThis.getMethod(statement.property.lexeme)) {
      executor.error("UnexpectedChangeOfMethodReference", statement.property.location, {
        name: statement.property.lexeme,
      });
    }

    if (!executor.contextualThis.hasProperty(statement.property.lexeme)) {
      executor.error("PropertySetterUsedOnNonPropertyTarget", statement.property.location, {
        name: statement.property.lexeme,
      });
    }
    // Checking if property already exists - undefined is a valid check here
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (executor.contextualThis.getField(statement.property.lexeme) !== undefined) {
      executor.error("PropertyAlreadySetInConstructor", statement.property.location, {
        name: statement.property.lexeme,
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

    executor.guardNoneJikiObject(value.jikiObject, statement.location);
    executor.contextualThis.setField(statement.property.lexeme, value.jikiObject as any);

    return {
      type: "SetPropertyStatement",
      property: statement.property.lexeme,
      value: value,
    };
  });
}
