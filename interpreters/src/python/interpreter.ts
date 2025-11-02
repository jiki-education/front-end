import { Parser } from "./parser";
import { Executor } from "./executor";
import type { SyntaxError as PySyntaxError } from "./error";
import type { CompilationResult } from "../shared/errors";
import type { LanguageFeatures } from "./interfaces";
import type { ExternalFunction, InterpretResult } from "../shared/interfaces";
import type { JikiObject } from "./jikiObjects";

// Evaluation context that includes external functions
export interface EvaluationContext {
  languageFeatures?: LanguageFeatures;
  externalFunctions?: ExternalFunction[];
}

// Result type for evaluateFunction - extends InterpretResult with return value
export type EvaluateFunctionResult = InterpretResult & {
  value: any;
  jikiObject?: JikiObject;
};

/**
 * Compiles Python source code without executing it.
 * Returns { success: true } on successful compilation or { success: false, error } on parse/syntax errors.
 */
export function compile(sourceCode: string, context: EvaluationContext = {}): CompilationResult {
  try {
    const parser = new Parser(context);
    parser.parse(sourceCode);
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error as PySyntaxError };
  }
}

export function interpret(sourceCode: string, context: EvaluationContext = {}): InterpretResult {
  try {
    // Parse the source code (compilation step)
    const parser = new Parser(context);
    const statements = parser.parse(sourceCode);

    // Execute statements
    const executor = new Executor(sourceCode, context);
    const result = executor.execute(statements);

    return {
      frames: result.frames,
      logLines: executor.logLines,
      error: null, // No parse error
      success: result.success,
      meta: {
        functionCallLog: {},
        statements: statements,
      },
    };
  } catch (error: unknown) {
    // Only parsing/compilation errors are returned as errors
    return {
      frames: [],
      logLines: [],
      error: error as PySyntaxError,
      success: false,
      meta: {
        functionCallLog: {},
        statements: [],
      },
    };
  }
}

/**
 * Evaluates a function call in Python source code.
 * Used for IO exercises - executes student code to define functions,
 * then calls a specific function with provided arguments and returns the result.
 *
 * @param sourceCode - Student's Python code containing function definitions
 * @param context - Evaluation context with language features and external functions
 * @param functionName - Name of the function to call
 * @param args - Arguments to pass to the function
 * @returns Result including the function's return value, frames, and execution metadata
 */
export function evaluateFunction(
  sourceCode: string,
  context: EvaluationContext = {},
  functionName: string,
  ...args: any[]
): EvaluateFunctionResult {
  // Parse the student's source code - let parse errors throw (matches JikiScript behavior)
  const parser = new Parser(context);
  const statements = parser.parse(sourceCode);

  // Generate the function call code
  // Python uses repr() style for strings and other values
  const formattedArgs = args.map(arg => {
    if (typeof arg === "string") {
      return `"${arg}"`;
    } else if (Array.isArray(arg)) {
      return JSON.stringify(arg);
    } else if (typeof arg === "object" && arg !== null) {
      return JSON.stringify(arg);
    }
    return String(arg);
  });
  const callingCode = `${functionName}(${formattedArgs.join(", ")})`;

  // Parse the calling code - let parse errors throw
  const callingParser = new Parser(context);
  const callingStatements = callingParser.parse(callingCode);

  if (callingStatements.length !== 1) {
    throw new Error(`Expected exactly one statement for function call, got ${callingStatements.length}`);
  }

  // Create executor and execute in two phases:
  // 1. Execute student code (defines functions)
  // 2. Execute function call (calls the function)
  // Runtime errors are captured in frames, not thrown
  const executor = new Executor(sourceCode, context);

  // Phase 1: Execute student code to define functions
  executor.execute(statements);

  // Phase 2: Evaluate the function call
  const callResult = executor.evaluateSingleExpression(callingStatements[0]);

  return {
    value: callResult.value,
    jikiObject: callResult.jikiObject,
    frames: callResult.frames,
    logLines: callResult.logLines,
    success: callResult.success,
    error: null,
    meta: {
      functionCallLog: callResult.meta.functionCallLog,
      statements: statements, // Return the original student code statements
    },
  };
}
