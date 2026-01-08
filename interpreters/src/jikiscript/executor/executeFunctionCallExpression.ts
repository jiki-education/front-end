import type { Executor } from "../executor";
import type { FunctionCallExpression } from "../expression";
import { FunctionCallTypeMismatchError, isRuntimeError, LogicError } from "../error";
import type { Arity } from "../functions";
import { isCallable } from "../functions";
import type {
  EvaluationResult,
  EvaluationResultFunctionCallExpression,
  EvaluationResultFunctionLookupExpression,
} from "../evaluation-result";
import { isNumber } from "../checks";
import type { JikiObject } from "../jikiObjects";
import { unwrapJikiObject, wrapJSToJikiObject } from "../jikiObjects";
import type { Location } from "../location";
import { CustomFunctionError } from "../interpreter";

function throwMissingFunctionError(executor: Executor, expression: FunctionCallExpression, e: Error) {
  if (!isRuntimeError(e)) {
    throw e;
  }
  if (e.type !== "FunctionNotFoundInScope") {
    throw e;
  }

  if (e.context?.didYouMean?.function?.length > 0) {
    const alternative = e.context.didYouMean.function;
    executor.error("FunctionNotFoundWithSimilarNameSuggestion", e.location, {
      ...e.context,
      suggestion: alternative,
      name: expression.callee.name.lexeme,
    });
  }

  executor.error("FunctionNotFoundInScope", e.location, {
    ...e.context,
    ...{
      name: expression.callee.name.lexeme,
    },
  });
}

export function executeFunctionCallExpression(
  executor: Executor,
  expression: FunctionCallExpression
): EvaluationResultFunctionCallExpression {
  let ce;

  // The catch here always rethrows the error.
  try {
    ce = executor.evaluate(expression.callee);
  } catch (e: any) {
    throwMissingFunctionError(executor, expression, e);
  }
  const callee = ce as unknown as EvaluationResultFunctionLookupExpression;

  if (!isCallable(callee.function)) {
    executor.error("NonCallableTargetInvocationAttempt", expression.location, { callee });
  }

  const args: EvaluationResult[] = [];
  for (const arg of expression.args) {
    args.push(executor.evaluate(arg));
  }
  const arity = callee.function.arity;
  guardArityOnCallExpression(executor, arity, args, expression.location, callee.name);

  const fnName = callee.name;
  let returnedNativeValue: any | void;

  executor.addFunctionToCallStack(fnName, expression);

  try {
    // Log it's usage for testing checks
    const argResults = args.map(arg => unwrapJikiObject(arg.jikiObject));
    executor.addFunctionCallToLog(fnName, argResults);

    // Reset this so it's not used in functions
    returnedNativeValue = executor.withThis(null, () =>
      callee.function.call(
        executor.getExecutionContext(),
        args.map(arg => arg.jikiObject?.toArg())
      )
    );
  } catch (e) {
    if (e instanceof CustomFunctionError) {
      executor.error("CustomFunctionErrorInExecution", expression.location, {
        message: e.message,
      });
    }
    if (e instanceof FunctionCallTypeMismatchError) {
      executor.error("FunctionCallTypeMismatchError", expression.location, e.context);
    } else if (e instanceof LogicError) {
      executor.error("LogicErrorInExecution", expression.location, { message: e.message });
    } else {
      throw e;
    }
  } finally {
    executor.popCallStack();
  }

  const jikiObject = (
    returnedNativeValue !== undefined && returnedNativeValue !== null
      ? wrapJSToJikiObject(returnedNativeValue)
      : undefined
  ) as JikiObject;
  return {
    type: "FunctionCallExpression",
    jikiObject: jikiObject,
    // jikiObject can be undefined for void functions
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    immutableJikiObject: jikiObject?.clone(),
    callee,
    args,
  };
}

export function guardArityOnCallExpression(
  executor: Executor,
  arity: Arity,
  args: EvaluationResult[],
  location: Location,
  name: string
) {
  const [minArity, maxArity] = isNumber(arity) ? [arity, arity] : arity;

  if (args.length < minArity || args.length > maxArity) {
    if (minArity !== maxArity) {
      executor.error("InvalidNumberOfArgumentsWithOptionalParameters", location, {
        name,
        minArity,
        maxArity,
        numberOfArgs: args.length,
      });
    }

    if (args.length < minArity) {
      executor.error("RangeErrorTooFewArgumentsForFunctionCall", location, {
        name,
        arity: maxArity,
        numberOfArgs: args.length,
        args,
      });
    } else {
      executor.error("RangeErrorTooManyArgumentsForFunctionCall", location, {
        name,
        arity: maxArity,
        numberOfArgs: args.length,
        args,
      });
    }
  }
}
