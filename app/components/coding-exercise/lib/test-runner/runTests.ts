import type { ExerciseDefinition, Language } from "@jiki/curriculum";
import { javascript, jikiscript, python } from "@jiki/interpreters";
import type { TestResult, TestSuiteResult } from "../test-results-types";
import { runIOScenario } from "./runIOScenario";
import { runVisualScenario } from "./runVisualScenario";

// Map language to interpreter
const interpreters = {
  javascript,
  python,
  jikiscript
};

function getInterpreter(language: Language) {
  const interpreter = interpreters[language as keyof typeof interpreters];
  // Defensive check (TypeScript guarantees this, but good for runtime safety)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!interpreter) {
    throw new Error(`Unknown language: ${language}`);
  }
  return interpreter;
}

export function runTests(studentCode: string, exercise: ExerciseDefinition, language: Language): TestSuiteResult {
  // Get available functions based on exercise type, with names formatted for the target language
  let availableFunctions: Array<{ name: string; func: any; description: string }>;

  if (exercise.type === "visual") {
    // Visual exercises: create instance to get functions
    const tempExercise = new exercise.ExerciseClass();
    availableFunctions = tempExercise.getExternalFunctions(language);
  } else {
    // IO exercises: get static functions
    availableFunctions = exercise.ExerciseClass.getExternalFunctions(language);
  }

  // Compile ONCE before running any scenarios
  const interpreter = getInterpreter(language);
  const compilationResult = interpreter.compile(studentCode, {
    externalFunctions: availableFunctions,
    languageFeatures: {
      timePerFrame: 1,
      ...exercise.interpreterOptions
    }
  });

  // If compilation failed, throw the error
  if (!compilationResult.success) {
    throw compilationResult.error;
  }

  // Compilation succeeded, run all scenarios
  const tests: TestResult[] = [];

  if (exercise.type === "visual") {
    // Run visual scenarios
    for (const scenario of exercise.scenarios) {
      const result = runVisualScenario(
        scenario,
        studentCode,
        exercise.ExerciseClass,
        language,
        exercise.interpreterOptions
      );
      tests.push(result);
    }
  } else {
    // Run IO scenarios
    for (const scenario of exercise.scenarios) {
      const result = runIOScenario(scenario, studentCode, availableFunctions, language, exercise.interpreterOptions);
      tests.push(result);
    }
  }

  const result: TestSuiteResult = {
    tests,
    passed: tests.every((t) => t.status === "pass")
  };

  return result;
}
