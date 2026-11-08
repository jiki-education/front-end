import type {
  ExerciseDefinition,
  IOValue,
  Language,
  Messages as CurriculumMessages,
  VisualExercise
} from "@jiki/curriculum";
import { getLanguageFeatures } from "@jiki/curriculum";
import type { Messages as InterpreterMessages } from "@jiki/interpreters";
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
 * language, by instantiating the exercise (uniform for visual and IO).
 */
export function getAvailableFunctions(
  exercise: ExerciseDefinition,
  language: Language
): Array<{ name: string; func: any; description: string }> {
  const tempExercise = new exercise.ExerciseClass();
  return tempExercise.getExternalFunctions(language);
}

export interface VisualExecutionOptions {
  ExerciseClass: new () => VisualExercise;
  language: Language;
  interpreter: Interpreter;
  languageFeatures?: Record<string, any>;
  interpreterLocaleMessages: InterpreterMessages;
  exerciseLocaleMessages: CurriculumMessages;
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

  // Inject the active-locale message dict before student code runs so the
  // exercise's logic-error strings (`this.t(...)`) resolve for this locale.
  exercise.setMessages(options.exerciseLocaleMessages);

  options.setup?.(exercise);

  const interpreterContext = {
    externalFunctions: exercise.getExternalFunctions(options.language),
    classes: exercise.getExternalClasses(options.language),
    languageFeatures: options.languageFeatures ?? { timePerFrame: 1 },
    randomSeed: options.randomSeed,
    localeMessages: options.interpreterLocaleMessages,
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
  interpreterLocaleMessages: InterpreterMessages;
  functionName: string; // snake_case; formatted for the target language internally
  args: IOValue[];
}

export interface IOEvaluationOutcome {
  interpretResult: InterpretResult | undefined; // undefined when evaluateFunction itself threw
  actual: IOValue | undefined; // the function's return value; undefined when the run errored
  errorMessage?: string;
}

/**
 * Evaluates the student's function once with the given arguments, capturing
 * runtime errors and interpreter throws instead of propagating them.
 */
export function evaluateIOFunction(studentCode: string, options: IOEvaluationOptions): IOEvaluationOutcome {
  try {
    const interpretResult = options.interpreter.evaluateFunction(
      studentCode,
      {
        externalFunctions: options.availableFunctions,
        languageFeatures: options.languageFeatures ?? { timePerFrame: 1 },
        localeMessages: options.interpreterLocaleMessages
      },
      options.interpreter.formatIdentifier(options.functionName),
      ...options.args
    );

    if (interpretResult.error) {
      return { interpretResult, actual: undefined, errorMessage: interpretResult.error.message };
    }
    return { interpretResult, actual: interpretResult.value };
  } catch (error) {
    return {
      interpretResult: undefined,
      actual: undefined,
      errorMessage: error instanceof Error ? error.message : String(error)
    };
  }
}
