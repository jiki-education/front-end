import type { ExerciseDefinition } from "@jiki/curriculum";
import { jikiscript, javascript, python } from "@jiki/interpreters";
import type { TestResult, TestSuiteResult } from "../test-results-types";
import { runVisualScenario } from "./runVisualScenario";
import { runIOScenario } from "./runIOScenario";

type Language = "javascript" | "python" | "jikiscript";

// Map language to interpreter
const interpreters = {
  javascript,
  python,
  jikiscript
};

function getInterpreter(language: Language) {
  const interpreter = interpreters[language];
  // Defensive check (TypeScript guarantees this, but good for runtime safety)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!interpreter) {
    throw new Error(`Unknown language: ${language}`);
  }
  return interpreter;
}

export function runTests(studentCode: string, exercise: ExerciseDefinition, language: Language): TestSuiteResult {
  // Get available functions based on exercise type
  let availableFunctions: Array<{ name: string; func: any; description: string }>;

  if (exercise.type === "visual") {
    // Visual exercises: create instance to get functions
    const tempExercise = new exercise.ExerciseClass();
    availableFunctions = tempExercise.availableFunctions;
  } else {
    // IO exercises: get static functions
    availableFunctions = exercise.ExerciseClass.availableFunctions;
  }

  // Compile ONCE before running any scenarios
  const interpreter = getInterpreter(language);
  const compilationResult = interpreter.compile(studentCode, {
    externalFunctions: availableFunctions.map((func) => ({
      name: func.name,
      func: func.func
    })) as any,
    languageFeatures: {
      timePerFrame: 1,
      maxTotalLoopIterations: 1000
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
      const result = runVisualScenario(scenario, studentCode, exercise.ExerciseClass, language);
      tests.push(result);
    }
  } else {
    // Run IO scenarios
    for (const scenario of exercise.scenarios) {
      const result = runIOScenario(scenario, studentCode, availableFunctions, language);
      tests.push(result);
    }
  }

  // Determine overall status
  const status = tests.every((t) => t.status === "pass") ? "pass" : "fail";

  const result: TestSuiteResult = {
    tests,
    status
  };

  return result;
}
