import type { ProgressionScores } from "@/lib/api/lessons";
import type { ExerciseDefinition, Language } from "@jiki/curriculum";
import type { TestResult, TestSuiteResult } from "../test-results-types";
import { bonusScenarioSlugs } from "../bonusScenarios";
import { buildLanguageFeatures, getAvailableFunctions } from "./executeStudentCode";
import { evaluateProgression } from "./progression";
import { runIOScenario } from "./runIOScenario";
import { runVisualScenario } from "./runVisualScenario";
import { getInterpreter } from "./getInterpreter";

export interface TestRunOutcome {
  testSuiteResult: TestSuiteResult;
  // Hidden progression scores for this run, evaluated from the scenario runs
  // above. Feeds the submission payload only - never the store or the UI.
  progressionScores: ProgressionScores;
}

export async function runTests(
  studentCode: string,
  exercise: ExerciseDefinition,
  language: Language
): Promise<TestRunOutcome> {
  const interpreter = await getInterpreter(language);

  // Get available functions based on exercise type, with names formatted for the target language
  const availableFunctions = getAvailableFunctions(exercise, language);

  // Build language features: level features + exercise overrides
  const languageFeatures = buildLanguageFeatures(exercise, language);

  // Compile ONCE before running any scenarios to catch syntax errors early
  const compilationResult = interpreter.compile(studentCode, {
    externalFunctions: availableFunctions,
    languageFeatures
  });

  // If compilation failed, throw the error
  if (!compilationResult.success) {
    throw compilationResult.error;
  }

  // Compilation succeeded, run all scenarios. Each test result carries its
  // run artifacts (exercise instance, interpreter result, return value) for
  // the progression evaluator below.
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
        languageFeatures
      );
      tests.push(result);
    }
  } else {
    // Run IO scenarios
    for (const scenario of exercise.scenarios) {
      const result = runIOScenario(scenario, studentCode, availableFunctions, language, interpreter, languageFeatures);
      tests.push(result);
    }
  }

  // Bonus scenarios are optional: they don't block completion. The exercise is
  // "passed" once every non-bonus scenario passes. Exercises without bonus tasks
  // fall through to the same "all tests pass" behaviour.
  const bonusSlugs = bonusScenarioSlugs(exercise);
  const requiredTests = bonusSlugs.size > 0 ? tests.filter((t) => !bonusSlugs.has(t.slug)) : tests;

  const testSuiteResult: TestSuiteResult = {
    tests,
    passed: requiredTests.every((t) => t.status === "pass")
  };

  // Evaluate the hidden progression test against the artifacts attached to
  // the test results. The store and the UI never read those artifacts.
  const progressionScores = evaluateProgression(exercise, language, tests);

  return { testSuiteResult, progressionScores };
}
