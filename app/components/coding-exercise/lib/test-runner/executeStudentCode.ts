import type { ExerciseDefinition, IOValue, Language, VisualExercise } from "@jiki/curriculum";
import { getLanguageFeatures } from "@jiki/curriculum";
import type { InterpretResult } from "@jiki/interpreters/shared";
import type { Interpreter } from "./getInterpreter";

// Shared student-code execution helpers. Every runner (visible scenarios and
// hidden progression tests) executes code through these so the exercise
// instantiation, function wiring and interpreter invocation cannot drift.

/**
 * Build the interpreter language features for an exercise: level features
 * plus per-exercise interpreter overrides.
 */
export function buildLanguageFeatures(exercise: ExerciseDefinition, language: Language): Record<string, any> {
  return {
    timePerFrame: 1,
    ...getLanguageFeatures(exercise.levelId, language),
    ...exercise.interpreterOptions
  };
}

/**
 * Get the exercise's available functions with names formatted for the target
 * language: visual exercises expose them per instance, IO exercises statically.
 */
export function getAvailableFunctions(
  exercise: ExerciseDefinition,
  language: Language
): Array<{ name: string; func: any; description: string }> {
  if (exercise.type === "visual") {
    const tempExercise = new exercise.ExerciseClass();
    return tempExercise.getExternalFunctions(language);
  }
  return exercise.ExerciseClass.getExternalFunctions(language);
}

export interface VisualExecutionOptions {
  ExerciseClass: new () => VisualExercise;
  language: Language;
  interpreter: Interpreter;
  languageFeatures?: Record<string, any>;
  setup?: (exercise: VisualExercise) => void;
  randomSeed?: number;
  functionCall?: { name: string; args: IOValue[] };
  secretConstants?: Record<string, number | string | boolean>;
}

/**
 * Creates a fresh visual exercise, runs setup, executes the student's code,
 * and returns both the exercise (for expectations / view) and the
 * InterpretResult (for frames / logLines / assertors).
 */
export function executeVisualStudentCode(
  studentCode: string,
  options: VisualExecutionOptions
): { exercise: VisualExercise; result: InterpretResult } {
  const exercise = new options.ExerciseClass();
  exercise.randomSeed = options.randomSeed;

  options.setup?.(exercise);

  const interpreterContext = {
    externalFunctions: exercise.getExternalFunctions(options.language),
    classes: exercise.getExternalClasses(options.language),
    languageFeatures: options.languageFeatures ?? { timePerFrame: 1 },
    randomSeed: options.randomSeed,
    ...(options.secretConstants ? { secretConstants: options.secretConstants } : {})
  };

  const result: InterpretResult = options.functionCall
    ? options.interpreter.evaluateFunction(
        studentCode,
        interpreterContext,
        options.interpreter.formatIdentifier(options.functionCall.name),
        ...options.functionCall.args
      )
    : options.interpreter.interpret(studentCode, interpreterContext);

  return { exercise, result };
}

export interface IOEvaluationOptions {
  interpreter: Interpreter;
  availableFunctions: Array<{ name: string; func: any; description: string }>;
  languageFeatures?: Record<string, any>;
  functionName: string; // snake_case; formatted for the target language internally
  args: IOValue[];
}

export interface IOEvaluationOutcome {
  result: InterpretResult | null; // null when evaluateFunction itself threw
  actual: any; // the function's return value; undefined when the run errored
  errorMessage?: string;
}

/**
 * Evaluates the student's function once with the given arguments, capturing
 * runtime errors and interpreter throws instead of propagating them.
 */
export function evaluateIOFunction(studentCode: string, options: IOEvaluationOptions): IOEvaluationOutcome {
  try {
    const result: InterpretResult = options.interpreter.evaluateFunction(
      studentCode,
      {
        externalFunctions: options.availableFunctions,
        languageFeatures: options.languageFeatures ?? { timePerFrame: 1 }
      },
      options.interpreter.formatIdentifier(options.functionName),
      ...options.args
    );

    if (result.error) {
      return { result, actual: undefined, errorMessage: result.error.message };
    }
    return { result, actual: (result as { value?: any }).value };
  } catch (error) {
    return {
      result: null,
      actual: undefined,
      errorMessage: error instanceof Error ? error.message : String(error)
    };
  }
}
