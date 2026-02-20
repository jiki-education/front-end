import type { Executor } from "../executor";
import { RuntimeError } from "../executor";
import type { NewExpression } from "../expression";
import type { EvaluationResultNewExpression } from "../evaluation-result";
import type { EvaluationResultExpression } from "../evaluation-result";
import { JSClass } from "../jsObjects/JSClass";
import type { JikiObject } from "../jsObjects";
import { LogicError } from "../error";

export function executeNewExpression(executor: Executor, expression: NewExpression): EvaluationResultNewExpression {
  // Look up the class in the environment
  const className = expression.className.name.lexeme;
  let classValue: any;
  try {
    classValue = executor.environment.get(className);
  } catch {
    executor.error("ClassNotFound", expression.location, { name: className });
  }

  if (!(classValue instanceof JSClass)) {
    executor.error("ClassNotFound", expression.location, { name: className });
  }

  const jsClass = classValue;

  // Evaluate arguments
  const argResults: EvaluationResultExpression[] = [];
  const argJikiObjects: JikiObject[] = [];
  for (const arg of expression.args) {
    const argResult = executor.evaluate(arg);
    argResults.push(argResult);
    argJikiObjects.push(argResult.jikiObject);
  }

  // Check arity
  const arity = jsClass.arity;
  const [minArity, maxArity] = typeof arity === "number" ? [arity, arity] : arity;
  if (argJikiObjects.length < minArity || argJikiObjects.length > maxArity) {
    const arityMessage =
      minArity === maxArity
        ? `${minArity}`
        : maxArity === Infinity
          ? `at least ${minArity}`
          : `between ${minArity} and ${maxArity}`;

    executor.error("InvalidNumberOfArguments", expression.location, {
      function: className,
      expected: arityMessage,
      got: argJikiObjects.length,
    });
  }

  // Instantiate
  try {
    const instance = jsClass.instantiate(executor.getExecutionContext(), argJikiObjects);
    return {
      type: "NewExpression",
      className: className,
      args: argResults,
      jikiObject: instance,
      immutableJikiObject: instance.clone(),
    };
  } catch (e) {
    if (e instanceof LogicError) {
      executor.error("LogicErrorInExecution", expression.location, { message: e.message });
    }
    if (e instanceof RuntimeError) {
      throw e;
    }
    throw new RuntimeError(
      `FunctionExecutionError: function: ${className}: message: ${(e as Error).message}`,
      expression.location,
      "FunctionExecutionError",
      { function: className, message: (e as Error).message }
    );
  }
}
