import { LogicError } from "../error";
import type { EvaluationResultGetterExpression } from "../evaluation-result";
import type { Executor } from "../executor";
import type { AccessorExpression } from "../expression";
import * as Jiki from "../jikiObjects";

export function executeGetterExpression(
  executor: Executor,
  expression: AccessorExpression
): EvaluationResultGetterExpression {
  const object = executor.evaluate(expression.object);
  if (!(object.jikiObject instanceof Jiki.Instance)) {
    executor.error("AccessorUsedOnNonInstanceObject", expression.location);
  }
  const getterName = expression.property.lexeme;
  const getter = object.jikiObject.getGetter(getterName);

  if (!getter) {
    if (object.jikiObject.getMethod(getterName)) {
      executor.error("MethodUsedAsGetterInsteadOfCall", expression.property.location, {
        name: getterName,
      });
    }
    executor.error("GetterMethodNotFoundOnObject", expression.property.location, {
      name: getterName,
    });
  }
  if (getter.visibility === "private" && expression.object.type !== "ThisExpression") {
    executor.error("UnexpectedPrivateGetterAccessAttempt", expression.property.location, {
      name: getterName,
    });
  }

  let value;
  try {
    value = getter.fn.apply(undefined, [executor.getExecutionContext(), object.jikiObject]);
  } catch (e: unknown) {
    if (e instanceof LogicError) {
      executor.error("LogicErrorInExecution", expression.location, { message: e.message });
    }
    throw e;
  }

  return {
    type: "GetterExpression",
    jikiObject: value,
    // value can be undefined for getters that return nothing
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    immutableJikiObject: value?.clone(),
    object,
  };
}
