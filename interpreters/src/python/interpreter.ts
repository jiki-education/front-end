import { Parser } from "./parser";
import { Executor } from "./executor";
import type { SyntaxError } from "./error";
import type { Frame } from "../shared/frames";
import type { CompilationResult } from "../shared/errors";
import type { LanguageFeatures } from "./interfaces";
import type { ExternalFunction } from "../shared/interfaces";

// Evaluation context that includes external functions
export interface EvaluationContext {
  languageFeatures?: LanguageFeatures;
  externalFunctions?: ExternalFunction[];
}

// Update InterpretResult to match shared pattern
export interface InterpretResult {
  frames: Frame[];
  error: SyntaxError | null; // Only parse/syntax errors, never runtime errors
  success: boolean;
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
  } catch (error) {
    return { success: false, error: error as SyntaxError };
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
      error: null, // No parse error
      success: result.success,
    };
  } catch (error) {
    // Only parsing/compilation errors are returned as errors
    return {
      frames: [],
      error: error as SyntaxError,
      success: false,
    };
  }
}
