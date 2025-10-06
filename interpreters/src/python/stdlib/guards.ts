import type { JikiObject } from "../jikiObjects";
import { PyNumber, PyString, PyBoolean, PyList, PyNone } from "../jikiObjects";
import { StdlibError } from "./index";

/**
 * Guard function to validate the exact number of arguments
 * @param args - The arguments array to validate
 * @param expected - The expected number of arguments
 * @param functionName - The name of the function for error messages
 * @throws StdlibError if the number of arguments doesn't match
 */
export function guardExactArgs(args: JikiObject[], expected: number, functionName: string): void {
  if (args.length !== expected) {
    throw new StdlibError(
      "TypeError",
      `${functionName}() takes exactly ${expected} argument${expected === 1 ? "" : "s"} (${args.length} given)`,
      {
        expected,
        received: args.length,
      }
    );
  }
}

/**
 * Guard function to validate the number of arguments is within a range
 * @param args - The arguments array to validate
 * @param min - The minimum number of arguments
 * @param max - The maximum number of arguments (use Infinity for no upper limit)
 * @param functionName - The name of the function for error messages
 * @throws StdlibError if the number of arguments is out of range
 */
export function guardArgRange(args: JikiObject[], min: number, max: number, functionName: string): void {
  if (args.length < min || args.length > max) {
    let message: string;
    if (min === max) {
      message = `${functionName}() takes exactly ${min} argument${min === 1 ? "" : "s"} (${args.length} given)`;
    } else if (max === Infinity) {
      message = `${functionName}() takes at least ${min} argument${min === 1 ? "" : "s"} (${args.length} given)`;
    } else if (min === 0) {
      message = `${functionName}() takes at most ${max} argument${max === 1 ? "" : "s"} (${args.length} given)`;
    } else {
      message = `${functionName}() takes from ${min} to ${max} positional arguments but ${args.length} were given`;
    }

    throw new StdlibError("TypeError", message, {
      expected: min === max ? min : `${min}-${max}`,
      received: args.length,
    });
  }
}

/**
 * Guard function to validate no arguments are provided
 * @param args - The arguments array to validate
 * @param functionName - The name of the function for error messages
 * @throws StdlibError if any arguments are provided
 */
export function guardNoArgs(args: JikiObject[], functionName: string): void {
  if (args.length !== 0) {
    throw new StdlibError("TypeError", `${functionName}() takes no arguments (${args.length} given)`, {
      expected: 0,
      received: args.length,
    });
  }
}

type PyType = "int" | "float" | "str" | "bool" | "list" | "dict" | "NoneType" | "function" | "number";

/**
 * Guard function to validate argument types
 * @param arg - The argument to validate
 * @param expectedType - The expected Python type
 * @param functionName - The name of the function for error messages
 * @param argName - The name of the argument (optional, defaults to "argument")
 * @throws StdlibError if the argument type doesn't match
 */
export function guardArgType(
  arg: JikiObject,
  expectedType: PyType,
  functionName: string,
  argName: string = "argument"
): void {
  let isValid = false;
  let actualType = getPythonTypeName(arg);

  switch (expectedType) {
    case "number": // Accept either int or float
      isValid = arg instanceof PyNumber;
      break;
    case "int":
      isValid = arg instanceof PyNumber && Number.isInteger(arg.value);
      break;
    case "float":
      isValid = arg instanceof PyNumber;
      actualType = arg instanceof PyNumber ? (Number.isInteger(arg.value) ? "int" : "float") : actualType;
      break;
    case "str":
      isValid = arg instanceof PyString;
      break;
    case "bool":
      isValid = arg instanceof PyBoolean;
      break;
    case "list":
      isValid = arg instanceof PyList;
      break;
    case "NoneType":
      isValid = arg instanceof PyNone;
      break;
    case "function":
      isValid = arg.type === "function" || arg.type === "callable";
      break;
    case "dict":
      // For future dictionary implementation
      isValid = arg.type === "dictionary";
      break;
  }

  if (!isValid) {
    // Python-style error messages
    const article = expectedType === "int" ? "an" : "a";
    throw new StdlibError(
      "TypeError",
      `'${actualType}' object cannot be interpreted as ${article} ${expectedType === "number" ? "integer" : expectedType}`,
      {
        expected: expectedType,
        received: actualType,
        argument: argName,
      }
    );
  }
}

/**
 * Guard function to validate that a number is an integer
 * @param arg - The PyNumber argument to validate
 * @param functionName - The name of the function for error messages
 * @param argName - The name of the argument (optional)
 * @throws StdlibError if the argument is not an integer
 */
export function guardInteger(arg: PyNumber, functionName: string, argName: string = "argument"): void {
  if (!Number.isInteger(arg.value)) {
    throw new StdlibError("TypeError", `'float' object cannot be interpreted as an integer`, {
      argument: argName,
      value: arg.value,
    });
  }
}

/**
 * Helper function to get the Python type name for an object
 */
function getPythonTypeName(obj: JikiObject): string {
  if (obj instanceof PyNumber) {
    return Number.isInteger(obj.value) ? "int" : "float";
  }
  if (obj instanceof PyString) {
    return "str";
  }
  if (obj instanceof PyBoolean) {
    return "bool";
  }
  if (obj instanceof PyList) {
    return "list";
  }
  if (obj instanceof PyNone) {
    return "NoneType";
  }
  if (obj.type === "function" || obj.type === "callable") {
    return "function";
  }
  if (obj.type === "dictionary") {
    return "dict";
  }
  return obj.type;
}
