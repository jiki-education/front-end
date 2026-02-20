import type { Executor } from "../executor";
import type { MemberExpression, LiteralExpression } from "../expression";
import type { EvaluationResultMemberExpression, EvaluationResultExpression } from "../evaluation-result";
import type { JSInstance } from "../jsObjects/JSInstance";
import { JSBoundMethod } from "../jsObjects/JSBoundMethod";
import { LogicError } from "../error";

export function executeInstanceMemberExpression(
  executor: Executor,
  expression: MemberExpression,
  objectResult: EvaluationResultExpression,
  instance: JSInstance
): EvaluationResultMemberExpression {
  // Only dot notation allowed for instances (not computed)
  if (expression.computed) {
    executor.error("TypeError", expression.location, {
      message: "Bracket notation is not supported on class instances. Use dot notation instead.",
    });
  }

  const propertyName = (expression.property as LiteralExpression).value as string;

  // Check for getter first
  const getter = instance.getGetter(propertyName);
  if (getter) {
    try {
      const value = getter.fn(executor.getExecutionContext(), instance);
      return {
        type: "MemberExpression",
        object: objectResult,
        property: { type: "LiteralExpression", jikiObject: value, immutableJikiObject: value.clone() },
        jikiObject: value,
        immutableJikiObject: value.clone(),
      };
    } catch (e) {
      if (e instanceof LogicError) {
        executor.error("LogicErrorInExecution", expression.location, { message: e.message });
      }
      throw e;
    }
  }

  // Check for method - return bound method
  const method = instance.getMethod(propertyName);
  if (method) {
    const boundMethod = new JSBoundMethod(instance, method);
    return {
      type: "MemberExpression",
      object: objectResult,
      property: { type: "LiteralExpression", jikiObject: boundMethod, immutableJikiObject: boundMethod.clone() },
      jikiObject: boundMethod,
      immutableJikiObject: boundMethod.clone(),
    };
  }

  // Neither getter nor method found
  executor.error("PropertyNotFoundOnInstance", expression.location, {
    property: propertyName,
    className: instance.getClassName(),
  });
}
