import { parse } from "./parser";
import { Executor } from "./executor";
import type { SyntaxError as JSSyntaxError } from "./error";
import type { CompilationResult } from "../shared/errors";
import type { LanguageFeatures } from "./interfaces";
import type { ExternalFunction, InterpretResult } from "../shared/interfaces";

// Evaluation context that includes external functions
export interface EvaluationContext {
  languageFeatures?: LanguageFeatures;
  externalFunctions?: ExternalFunction[];
}

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
      },
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
      },
    };
  }
}
