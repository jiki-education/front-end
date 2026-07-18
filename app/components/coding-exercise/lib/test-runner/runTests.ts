import type { ExerciseDefinition, Language } from "@jiki/curriculum";
import { getLanguageFeatures } from "@jiki/curriculum";
import type { Messages } from "@jiki/interpreters";
import type { TestResult, TestSuiteResult } from "../test-results-types";
import { bonusScenarioSlugs } from "../bonusScenarios";
import { runIOScenario } from "./runIOScenario";
import { runVisualScenario } from "./runVisualScenario";
import { getInterpreter } from "./getInterpreter";

export async function runTests(
  studentCode: string,
  exercise: ExerciseDefinition,
  language: Language,
  interpreterLocaleMessages: Messages
): Promise<TestSuiteResult> {
  const interpreter = await getInterpreter(language);

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

  // Build language features: level features + exercise overrides
  const levelFeatures = getLanguageFeatures(exercise.levelId, language);
  const languageFeatures = {
    timePerFrame: 1,
    ...levelFeatures,
    ...exercise.interpreterOptions
  };

  // Compile ONCE before running any scenarios to catch syntax errors early
  const compilationResult = interpreter.compile(studentCode, {
    externalFunctions: availableFunctions,
    languageFeatures,
    localeMessages: interpreterLocaleMessages
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
        interpreter,
        languageFeatures,
        interpreterLocaleMessages
      );
      tests.push(result);
    }
  } else {
    // Run IO scenarios
    for (const scenario of exercise.scenarios) {
      const result = runIOScenario(
        scenario,
        studentCode,
        availableFunctions,
        language,
        interpreter,
        languageFeatures,
        interpreterLocaleMessages
      );
      tests.push(result);
    }
  }

  // Bonus scenarios are optional: they don't block completion. The exercise is
  // "passed" once every non-bonus scenario passes. Exercises without bonus tasks
  // fall through to the same "all tests pass" behaviour.
  const bonusSlugs = bonusScenarioSlugs(exercise);
  const requiredTests = bonusSlugs.size > 0 ? tests.filter((t) => !bonusSlugs.has(t.slug)) : tests;

  const result: TestSuiteResult = {
    tests,
    passed: requiredTests.every((t) => t.status === "pass")
  };

  return result;
}
