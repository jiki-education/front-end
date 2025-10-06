import { jikiscript } from "@jiki/interpreters";
import type { Exercise } from "../Exercise";
import type { Scenario, TestExpect, ExerciseDefinition } from "../exercises/types";
import { getLanguageFeatures } from "../levels";

export interface ScenarioTestResult {
  slug: string;
  name: string;
  status: "pass" | "fail";
  expects: TestExpect[];
}

/**
 * Runs a single scenario test against student code.
 * Creates a fresh exercise instance, runs setup, executes code, and validates expectations.
 *
 * This is a lightweight test runner for curriculum validation - it does NOT:
 * - Build animation timelines (frontend concern)
 * - Generate frames for scrubber (frontend concern)
 * - Render views (frontend concern)
 *
 * It ONLY validates that the exercise state matches expectations after code execution.
 */
export function runScenarioTest(
  ExerciseClass: new () => Exercise,
  scenario: Scenario,
  studentCode: string,
  levelId: string,
  language: "jikiscript" | "javascript" | "python" = "jikiscript"
): ScenarioTestResult {
  // Create fresh exercise instance
  const exercise = new ExerciseClass();

  // Run setup to initialize exercise state
  scenario.setup(exercise);

  // Get language features for this level
  // TODO: Support javascript and python interpreters when available
  const languageFeatures = getLanguageFeatures(levelId, language === "jikiscript" ? "javascript" : language);

  // Execute student code with the exercise's available functions
  jikiscript.interpret(studentCode, {
    externalFunctions: exercise.availableFunctions.map((func) => ({
      name: func.name,
      func: func.func,
      description: func.description ?? ""
    })),
    languageFeatures: {
      timePerFrame: 1,
      maxTotalLoopIterations: 1000,
      ...languageFeatures
    }
  });

  // Run expectations to validate final state
  const expects = scenario.expectations(exercise);

  // Determine pass/fail status
  const status = expects.every((e) => e.pass) ? "pass" : "fail";

  return {
    slug: scenario.slug,
    name: scenario.name,
    status,
    expects
  };
}

/**
 * Runs all scenarios for an exercise against student code.
 * Returns array of test results.
 */
export function runAllScenarios(
  ExerciseClass: new () => Exercise,
  scenarios: Scenario[],
  studentCode: string,
  levelId: string,
  language: "jikiscript" | "javascript" | "python" = "jikiscript"
): ScenarioTestResult[] {
  return scenarios.map((scenario) => runScenarioTest(ExerciseClass, scenario, studentCode, levelId, language));
}

/**
 * Runs all scenarios for an exercise definition (includes levelId).
 * This is the recommended way to test exercises.
 */
export function runExerciseTests(
  exercise: ExerciseDefinition,
  studentCode: string,
  language: "jikiscript" | "javascript" | "python" = "jikiscript"
): ScenarioTestResult[] {
  return runAllScenarios(exercise.ExerciseClass, exercise.scenarios, studentCode, exercise.levelId, language);
}
