import { Parser } from "./parser";
import { Executor } from "./executor";
import type { SyntaxError as PySyntaxError } from "./error";
import type { CompilationResult } from "../shared/errors";
import type { LanguageFeatures } from "./interfaces";
import type { ExternalFunction, InterpretResult } from "../shared/interfaces";

// Evaluation context that includes external functions
export interface EvaluationContext {
  languageFeatures?: LanguageFeatures;
  externalFunctions?: ExternalFunction[];
}

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
