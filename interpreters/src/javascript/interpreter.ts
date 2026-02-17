import { parse } from "./parser";
import { Executor } from "./executor";
import type { SyntaxError as JSSyntaxError } from "./error";
import type { CompilationResult } from "../shared/errors";
import type { LanguageFeatures } from "./interfaces";
import type { ExternalFunction, InterpretResult } from "../shared/interfaces";
import type { JikiObject } from "./jikiObjects";
import { extractCallExpressions } from "./assertion-helpers";
import type { CallExpression } from "./expression";
import { LiteralExpression, type Expression } from "./expression";

// Evaluation context that includes external functions
export interface EvaluationContext {
  languageFeatures?: LanguageFeatures;
  externalFunctions?: ExternalFunction[];
  randomSeed?: number; // Seed for deterministic random number generation
}

// Result type for evaluateFunction - extends InterpretResult with return value
export type EvaluateFunctionResult = InterpretResult & {
  value: any;
  jikiObject?: JikiObject;
};

/**
 * Compiles JavaScript source code without executing it.
 * Returns { success: true } on successful compilation or { success: false, error } on parse/syntax errors.
 */
export function compile(sourceCode: string, context: EvaluationContext = {}): CompilationResult {
  try {
    parse(sourceCode, context);
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error as JSSyntaxError };
  }
}

export function interpret(sourceCode: string, context: EvaluationContext = {}): InterpretResult {
  try {
    // Parse the source code (compilation step)
    const statements = parse(sourceCode, context);

    // Execute statements
    const executor = new Executor(sourceCode, context);
    const result = executor.execute(statements);

    return {
      frames: result.frames,
      error: null, // No parse error
      success: result.success,
      logLines: executor.logLines,
      meta: {
        functionCallLog: {},
        statements: statements,
        sourceCode: sourceCode,
      },
      assertors: result.assertors,
    };
  } catch (error: unknown) {
    // Only parsing/compilation errors are returned as errors
    return {
      frames: [],
      error: error as JSSyntaxError,
      success: false,
      logLines: [],
      meta: {
        functionCallLog: {},
        statements: [],
        sourceCode: sourceCode,
      },
      assertors: {
        assertAllArgumentsAreVariables: () => true, // Defensive: don't fail on parse errors
      },
    };
  }
}

/**
 * Evaluates a function call in JavaScript source code.
 * Used for IO exercises - executes student code to define functions,
 * then calls a specific function with provided arguments and returns the result.
 *
 * @param sourceCode - Student's JavaScript code containing function definitions
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
  const statements = parse(sourceCode, context);

  // Generate the function call code
  const callingCode = `${functionName}(${args.map(arg => JSON.stringify(arg)).join(", ")})`;

  // Parse the calling code - let parse errors throw
  const callingStatements = parse(callingCode, context);

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
      sourceCode: sourceCode,
    },
    assertors: {
      assertAllArgumentsAreVariables: () => {
        return extractCallExpressions(statements).every((expr: CallExpression) => {
          return expr.args.every((arg: Expression) => {
            return !(arg instanceof LiteralExpression);
          });
        });
      },
    },
  };
}
