import type { Executor } from "../executor";
import { RuntimeError } from "../executor";
import type { CallExpression } from "../expression";
import type { EvaluationResultExpression, EvaluationResultCallExpression } from "../evaluation-result";
import { createPyObject, PyStdLibFunction, PyNone } from "../jikiObjects";
import type { JikiObject } from "../jikiObjects";
import type { Arity } from "../../shared/interfaces";
import { isCallable, type PyCallable, PyUserDefinedFunction, ReturnValue } from "../functions";
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
    // Get proper type name for error message
    let typeName = calleeValue.type;
    if (calleeValue instanceof PyNone) {
      typeName = "NoneType";
    } else if ("pythonTypeName" in calleeValue && typeof calleeValue.pythonTypeName === "function") {
      typeName = calleeValue.pythonTypeName();
    }
    executor.error("TypeError", expression.location, {
      message: `'${typeName}' object is not callable`,
    });
  }

  // Handle both PyCallable and PyStdLibFunction
  const callable = calleeValue as PyCallable | PyStdLibFunction;

  // Evaluate arguments and store both the results and JikiObjects
  const argResults: EvaluationResultExpression[] = [];
  const argJikiObjects: JikiObject[] = [];
  for (const arg of expression.args) {
    const argResult = executor.evaluate(arg);
    argResults.push(argResult);
    argJikiObjects.push(argResult.jikiObject);
  }

  // Check arity
  checkArity(executor, callable.arity, argJikiObjects.length, expression, callable.name);

  // Handle user-defined functions
  if (callable instanceof PyUserDefinedFunction) {
    return executeUserDefinedFunction(executor, callable, argJikiObjects, argResults);
  }

  // Handle PyStdLibFunction (stdlib methods)
  if (callable instanceof PyStdLibFunction) {
    return executeStdLibFunction(executor, callable, argJikiObjects, argResults, expression);
  }

  // Call the function (external functions)
  const executionContext = executor.getExecutionContext();

  try {
    // Convert JikiObjects to values for the function
    const argValues = argJikiObjects.map(arg => arg.value);
    const result = callable.call(executionContext, argValues);

    // Convert the result back to a PyObject
    const pyResult = createPyObject(result);

    return {
      type: "CallExpression",
      jikiObject: pyResult,
      immutableJikiObject: pyResult.clone(),
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
      executor.error("FunctionExecutionError", expression.location, {
        function: callable.name,
        message: error.message,
      });
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

    executor.error("InvalidNumberOfArguments", expression.location, {
      function: functionName,
      expected: arityMessage,
      got: argCount,
    });
  }
}

function executeUserDefinedFunction(
  executor: Executor,
  callable: PyUserDefinedFunction,
  argJikiObjects: JikiObject[],
  argResults: EvaluationResultExpression[]
): EvaluationResultCallExpression {
  const declaration = callable.getDeclaration();
  const environment = new Environment(executor.environment);
  const prevEnvironment = executor.environment;
  executor.environment = environment;

  // Bind parameters
  for (let i = 0; i < declaration.parameters.length; i++) {
    environment.define(declaration.parameters[i].name.lexeme, argJikiObjects[i]);
  }

  try {
    // Execute function body
    for (const statement of declaration.body) {
      executor.executeStatement(statement);
    }
    // No return statement - return None
    return {
      type: "CallExpression",
      functionName: callable.name,
      args: argResults,
      jikiObject: createPyObject(null),
      immutableJikiObject: createPyObject(null).clone(),
    };
  } catch (error) {
    if (error instanceof ReturnValue) {
      const jikiResult = error.value ?? createPyObject(null);
      return {
        type: "CallExpression",
        functionName: callable.name,
        args: argResults,
        jikiObject: jikiResult,
        immutableJikiObject: jikiResult.clone(),
      };
    }
    throw error;
  } finally {
    executor.environment = prevEnvironment;
  }
}

function executeStdLibFunction(
  executor: Executor,
  callable: PyStdLibFunction,
  argJikiObjects: JikiObject[],
  argResults: EvaluationResultExpression[],
  expression: CallExpression
): EvaluationResultCallExpression {
  try {
    // PyStdLibFunction expects JikiObjects, not raw values
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
      throw new RuntimeError(message, expression.location, error.errorType, error.context);
    }
    // Re-throw other errors
    throw error;
  }
}
