import type { Executor } from "../executor";
import { RuntimeError, type RuntimeErrorType } from "../executor";
import type { CallExpression } from "../expression";
import type { EvaluationResult, EvaluationResultCallExpression } from "../evaluation-result";
import { createJSObject, JSStdLibFunction, JSUndefined } from "../jikiObjects";
import { JSBoundMethod } from "../jsObjects/JSBoundMethod";
import type { JikiObject } from "../jikiObjects";
import type { Arity } from "../../shared/interfaces";
import { isCallable, type JSCallable, JSUserDefinedFunction, ReturnValue } from "../functions";
import { LogicError } from "../error";
import { Environment } from "../environment";
import { StdlibError } from "../stdlib";
import { translate } from "../translator";

export function executeCallExpression(executor: Executor, expression: CallExpression): EvaluationResultCallExpression {
  // Evaluate the callee
  const calleeResult = executor.evaluate(expression.callee);
  const calleeValue = calleeResult.jikiObject;

  // Check if the value is callable
  if (!isCallable(calleeValue)) {
    throw new RuntimeError(`TypeError: ${expression.callee.type} is not callable`, expression.location, "TypeError", {
      callee: expression.callee.type,
    });
  }

  // Type assertion since we know it's a JSCallable from our implementation
  const callable = calleeValue as JSCallable;

  // Evaluate arguments and store both the results and JikiObjects
  const argResults: EvaluationResult[] = [];
  const argJikiObjects: JikiObject[] = [];
  for (const arg of expression.args) {
    const argResult = executor.evaluate(arg);
    argResults.push(argResult);
    argJikiObjects.push(argResult.jikiObject);
  }

  // Check arity
  checkArity(executor, callable.arity, argJikiObjects.length, expression, callable.name);

  // Handle user-defined functions differently from external functions
  if (callable instanceof JSUserDefinedFunction) {
    return executeUserDefinedFunction(executor, callable, argJikiObjects, argResults);
  }

  // Handle JSStdLibFunction (stdlib methods)
  if (callable instanceof JSStdLibFunction) {
    return executeStdLibFunction(executor, callable, argJikiObjects, argResults, expression);
  }

  // Handle bound methods (instance method calls)
  if (callable instanceof JSBoundMethod) {
    return executeBoundMethod(executor, callable, argJikiObjects, argResults, expression);
  }

  // Handle external functions (JSCallable)
  // Note: External functions are wrapped in JSCallable, not JSStdLibFunction
  const executionContext = executor.getExecutionContext();

  try {
    // External functions receive and return JikiObjects
    const returnedNativeValue = callable.call(executionContext, argJikiObjects);
    const result = createJSObject(returnedNativeValue);

    // Guard that external functions actually return JikiObjects (runtime safety check)
    executor.guardNonJikiObject(result, expression.location);

    return {
      type: "CallExpression",
      jikiObject: result,
      immutableJikiObject: result.clone(),
      functionName: callable.name,
      args: argResults, // Store full evaluation results for describers
    };
  } catch (error) {
    // Handle LogicError from custom functions
    if (error instanceof LogicError) {
      executor.error("LogicErrorInExecution", expression.location, { message: error.message });
    }
    // Handle any other errors from the external function
    if (error instanceof Error) {
      throw new RuntimeError(
        `FunctionExecutionError: function: ${callable.name}: message: ${error.message}`,
        expression.location,
        "FunctionExecutionError",
        { function: callable.name, message: error.message }
      );
    }
    throw error;
  }
}

function checkArity(
  executor: Executor,
  arity: Arity | undefined,
  argCount: number,
  expression: CallExpression,
  functionName: string
): void {
  if (!arity) {
    // If arity is not specified, accept any number of arguments
    return;
  }

  const [minArity, maxArity] = typeof arity === "number" ? [arity, arity] : arity;

  if (argCount < minArity || argCount > maxArity) {
    const arityMessage =
      minArity === maxArity
        ? `${minArity}`
        : maxArity === Infinity
          ? `at least ${minArity}`
          : `between ${minArity} and ${maxArity}`;

    throw new RuntimeError(
      `InvalidNumberOfArguments: function: ${functionName}: expected: ${arityMessage}: got: ${argCount}`,
      expression.location,
      "InvalidNumberOfArguments",
      {
        function: functionName,
        expected: arityMessage,
        got: argCount,
      }
    );
  }
}

function executeUserDefinedFunction(
  executor: Executor,
  callable: JSUserDefinedFunction,
  argJikiObjects: JikiObject[],
  argResults: EvaluationResult[]
): EvaluationResultCallExpression {
  const declaration = callable.getDeclaration();
  // Create new environment with the closure (definition-time) environment as parent,
  // not the caller's environment. This ensures proper lexical scoping.
  const closureEnv = callable.getClosure() ?? executor.environment;
  const environment = new Environment(executor.languageFeatures, closureEnv);

  // Bind parameters (shadowing check is now handled inside environment.define())
  for (let i = 0; i < declaration.parameters.length; i++) {
    environment.define(
      declaration.parameters[i].name.lexeme,
      argJikiObjects[i],
      declaration.parameters[i].name.location
    );
  }

  // Execute function body in new environment
  try {
    executor.executeBlock(declaration.body, environment);
    // No return statement - return undefined
    const jikiResult = new JSUndefined();
    return {
      type: "CallExpression",
      jikiObject: jikiResult,
      immutableJikiObject: jikiResult.clone(),
      functionName: callable.name,
      args: argResults,
    };
  } catch (error) {
    if (error instanceof ReturnValue) {
      // Function returned a value (error.value is already a JikiObject or undefined)
      const jikiResult = error.value ?? new JSUndefined();
      return {
        type: "CallExpression",
        jikiObject: jikiResult,
        immutableJikiObject: jikiResult.clone(),
        functionName: callable.name,
        args: argResults,
      };
    }
    // Re-throw other errors
    throw error;
  }
}

function executeStdLibFunction(
  executor: Executor,
  callable: JSStdLibFunction,
  argJikiObjects: JikiObject[],
  argResults: EvaluationResult[],
  expression: CallExpression
): EvaluationResultCallExpression {
  try {
    // JSStdLibFunction expects JikiObjects, not raw values
    const result = callable.call(executor.getExecutionContext(), null, argJikiObjects);

    return {
      type: "CallExpression",
      jikiObject: result,
      immutableJikiObject: result.clone(),
      functionName: callable.name,
      args: argResults,
    };
  } catch (error) {
    // Convert StdlibError to RuntimeError with translated message
    if (error instanceof StdlibError) {
      // error.message is a translation key (e.g., "StdlibArgTypeMismatch")
      const message = translate(`error.stdlib.${error.message}`, error.context);
      throw new RuntimeError(message, expression.location, error.errorType as RuntimeErrorType, error.context);
    }
    // Re-throw other errors
    throw error;
  }
}

function executeBoundMethod(
  executor: Executor,
  callable: JSBoundMethod,
  argJikiObjects: JikiObject[],
  argResults: EvaluationResult[],
  expression: CallExpression
): EvaluationResultCallExpression {
  try {
    const result = callable.call(executor.getExecutionContext(), argJikiObjects);

    // Guard that bound methods return JikiObjects
    executor.guardNonJikiObject(result, expression.location);

    return {
      type: "CallExpression",
      jikiObject: result,
      immutableJikiObject: result.clone(),
      functionName: callable.name,
      args: argResults,
    };
  } catch (error) {
    if (error instanceof LogicError) {
      executor.error("LogicErrorInExecution", expression.location, { message: error.message });
    }
    if (error instanceof RuntimeError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new RuntimeError(
        `FunctionExecutionError: function: ${callable.name}: message: ${error.message}`,
        expression.location,
        "FunctionExecutionError",
        { function: callable.name, message: error.message }
      );
    }
    throw error;
  }
}
