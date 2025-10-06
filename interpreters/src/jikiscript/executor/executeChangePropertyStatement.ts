import type { Executor } from "../executor";
import type { ChangePropertyStatement } from "../statement";
import type { EvaluationResultChangePropertyStatement } from "../evaluation-result";
import { LogicError } from "../error";
import * as Jiki from "../jikiObjects";

export function executeChangePropertyStatement(executor: Executor, statement: ChangePropertyStatement): void {
  const object = executor.evaluate(statement.object);

  executor.executeFrame<EvaluationResultChangePropertyStatement>(statement, () => {
    if (!(object.jikiObject instanceof Jiki.Instance)) {
      executor.error("AccessorUsedOnNonInstanceObject", statement.object.location);
    }
    const setter = object.jikiObject.getSetter(statement.property.lexeme);
    if (!setter) {
      executor.error("SetterMethodNotFoundOnObject", statement.property.location, {
        name: statement.property.lexeme,
      });
    }
    if (setter.visibility === "private" && statement.object.type !== "ThisExpression") {
      executor.error("UnexpectedPrivateSetterAccessAttempt", statement.property.location, {
        name: statement.property.lexeme,
      });
    }

    const value = executor.evaluate(statement.value);
    executor.guardNoneJikiObject(value.jikiObject, statement.location);

    // Do the update
    const oldValue = object.jikiObject.getField(statement.property.lexeme);
    try {
      setter.fn.apply(undefined, [
        executor.getExecutionContext(),
        object.jikiObject,
        value.jikiObject as Jiki.JikiObject,
      ]);
    } catch (e: unknown) {
      if (e instanceof LogicError) {
        executor.error("LogicErrorInExecution", statement.location, { message: e.message });
      }
      throw e;
    }

    return {
      type: "ChangePropertyStatement",
      object,
      oldValue,
      value,
    };
  });
}
