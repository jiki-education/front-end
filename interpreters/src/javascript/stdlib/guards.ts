import type { JikiObject } from "../jsObjects";
import { JSNumber, JSString, JSBoolean, JSArray, JSNull, JSUndefined } from "../jsObjects";
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
      "InvalidNumberOfArguments",
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
    } else {
      message = `${functionName}() takes from ${min} to ${max} arguments (${args.length} given)`;
    }

    throw new StdlibError("InvalidNumberOfArguments", message, {
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
  guardExactArgs(args, 0, functionName);
}

type JSType = "number" | "string" | "boolean" | "array" | "object" | "null" | "undefined" | "function";

/**
 * Guard function to validate argument types
 * @param arg - The argument to validate
 * @param expectedType - The expected JavaScript type
 * @param functionName - The name of the function for error messages
 * @param argName - The name of the argument (optional, defaults to "argument")
 * @throws StdlibError if the argument type doesn't match
 */
export function guardArgType(
  arg: JikiObject,
  expectedType: JSType,
  functionName: string,
  argName: string = "argument"
): void {
  let isValid = false;
  let actualType = arg.type;

  switch (expectedType) {
    case "number":
      isValid = arg instanceof JSNumber;
      break;
    case "string":
      isValid = arg instanceof JSString;
      break;
    case "boolean":
      isValid = arg instanceof JSBoolean;
      break;
    case "array":
      isValid = arg instanceof JSArray;
      actualType = arg instanceof JSArray ? "array" : arg.type;
      break;
    case "null":
      isValid = arg instanceof JSNull;
      break;
    case "undefined":
      isValid = arg instanceof JSUndefined;
      break;
    case "function":
      // For future use when we have function objects
      isValid = arg.type === "function";
      break;
    case "object":
      // For dictionaries/objects
      isValid = arg.type === "dictionary";
      actualType = arg.type === "dictionary" ? "object" : arg.type;
      break;
  }

  if (!isValid) {
    throw new StdlibError("TypeError", `${functionName}(): ${argName} must be a ${expectedType} (got ${actualType})`, {
      expected: expectedType,
      received: actualType,
      argument: argName,
    });
  }
}

/**
 * Guard function to validate that an argument is an integer
 * @param arg - The number argument to validate
 * @param functionName - The name of the function for error messages
 * @param argName - The name of the argument (optional)
 * @throws StdlibError if the argument is not an integer
 */
export function guardInteger(arg: JSNumber, functionName: string, argName: string = "index"): void {
  if (!Number.isInteger(arg.value)) {
    throw new StdlibError("TypeError", `${functionName}(): ${argName} must be an integer`, {
      argument: argName,
      value: arg.value,
    });
  }
}
