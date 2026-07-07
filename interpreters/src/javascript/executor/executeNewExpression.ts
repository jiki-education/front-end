import type { Executor } from "../executor";
import { RuntimeError } from "../executor";
import type { NewExpression } from "../expression";
import type { EvaluationResultNewExpression } from "../evaluation-result";
import type { EvaluationResultExpression } from "../evaluation-result";
import { JSClass } from "../jsObjects/JSClass";
import type { JikiObject } from "../jsObjects";
import { LogicError, InterpreterInternalError } from "../error";

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
    // Pass structured data; the locale owns pluralisation via context + count
    // (mirrors executeCallExpression). Passing a context is required so en
    // resolves one of the _exact/_atLeast/_range variants.
    const context = minArity === maxArity ? "exact" : maxArity === Infinity ? "atLeast" : "range";

    executor.error("InvalidNumberOfArguments", expression.location, {
      function: className,
      context,
      expected: minArity,
      got: argJikiObjects.length,
      min: minArity,
      max: maxArity,
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
    if (e instanceof InterpreterInternalError) {
      throw e;
    }
    if (e instanceof LogicError) {
      executor.error("LogicErrorInExecution", expression.location, { message: e.message });
    }
    if (e instanceof RuntimeError) {
      throw e;
    }
    executor.error("FunctionExecutionError", expression.location, {
      function: className,
      message: (e as Error).message,
    });
  }
}
