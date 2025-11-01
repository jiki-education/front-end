import { jikiscript, javascript, python } from "@jiki/interpreters";
import type { VisualExercise, IOExercise } from "../Exercise";
import type { VisualScenario, IOScenario, TestExpect, ExerciseDefinition } from "../exercises/types";
import { getLanguageFeatures } from "../levels";

/**
 * Helper to get the appropriate interpreter for a language
 */
function getInterpreter(language: "jikiscript" | "javascript" | "python") {
  if (language === "jikiscript") return jikiscript;
  if (language === "javascript") return javascript;
  return python;
}

export interface ScenarioTestResult {
  slug: string;
  name: string;
  status: "pass" | "fail";
  expects: TestExpect[];
}

/**
 * Runs a single visual scenario test against student code.
 * Creates a fresh exercise instance, runs setup, executes code, and validates expectations.
 *
 * This is a lightweight test runner for curriculum validation - it does NOT:
 * - Build animation timelines (frontend concern)
 * - Generate frames for scrubber (frontend concern)
 * - Render views (frontend concern)
 *
 * It ONLY validates that the exercise state matches expectations after code execution.
 */
export function runVisualScenarioTest(
  ExerciseClass: new () => VisualExercise,
  scenario: VisualScenario,
  studentCode: string,
  levelId: string,
  language: "jikiscript" | "javascript" | "python" = "jikiscript"
): ScenarioTestResult {
  // Create fresh exercise instance
  const exercise = new ExerciseClass();

  // Run setup to initialize exercise state
  scenario.setup(exercise);

  // Get language features for this level
  const languageFeatures = getLanguageFeatures(levelId, language);

  // Execute student code with the exercise's available functions
  // Note: stdlib functions are automatically added by the interpreter based on languageFeatures.allowedStdlibFunctions
  const interpreter = getInterpreter(language);
  interpreter.interpret(studentCode, {
    externalFunctions: exercise.availableFunctions.map((func) => ({
      name: func.name,
      func: func.func,
      description: func.description ?? ""
    })),
    languageFeatures: {
      timePerFrame: 1,
      maxTotalLoopIterations: 1000,
      ...languageFeatures
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any
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
 * Runs a single IO scenario test against student code.
 * Calls the student's function with test arguments and compares the return value.
 */
export function runIOScenarioTest(
  ExerciseClass: typeof IOExercise,
  scenario: IOScenario,
  studentCode: string,
  levelId: string,
  language: "jikiscript" | "javascript" | "python" = "jikiscript"
): ScenarioTestResult {
  // Get language features for this level
  const languageFeatures = getLanguageFeatures(levelId, language);

  // Get available helper functions from the exercise class
  // Note: stdlib functions are automatically added by the interpreter based on languageFeatures.allowedStdlibFunctions
  const externalFunctions = ExerciseClass.availableFunctions.map((func) => ({
    name: func.name,
    func: func.func,
    description: func.description ?? ""
  }));

  // Call the student's function using evaluateFunction
  const interpreter = getInterpreter(language);
  const result = interpreter.evaluateFunction(
    studentCode,
    {
      externalFunctions,
      languageFeatures: {
        timePerFrame: 1,
        maxTotalLoopIterations: 1000,
        ...languageFeatures
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any
    },
    scenario.functionName,
    ...scenario.args
  );

  // Compare actual vs expected using the matcher
  const matcher = scenario.matcher ?? "toEqual";
  let pass = false;

  if (result.error) {
    pass = false;
  } else {
    switch (matcher) {
      case "toBe":
        pass = result.value === scenario.expected;
        break;
      case "toEqual":
        // Deep equality comparison
        pass = JSON.stringify(result.value) === JSON.stringify(scenario.expected);
        break;
      case "toBeGreaterThan":
        pass = result.value > scenario.expected;
        break;
      case "toBeLessThan":
        pass = result.value < scenario.expected;
        break;
    }
  }

  // Build TestExpect (note: this is for curriculum testing, not app testing)
  // The app's test runner creates proper IOTestExpect with diff
  const expects: TestExpect[] = [
    {
      type: "visual" as const, // Using visual type for curriculum tests
      pass,
      actual: result.error ? "error" : String(result.value),
      expected: String(scenario.expected),
      errorHtml: pass
        ? ""
        : `Expected ${scenario.functionName}(${scenario.args.map((a) => JSON.stringify(a)).join(", ")}) to return ${JSON.stringify(scenario.expected)}, but got ${result.error ? "error" : JSON.stringify(result.value)}`
    }
  ];

  return {
    slug: scenario.slug,
    name: scenario.name,
    status: pass ? "pass" : "fail",
    expects
  };
}

/**
 * Runs all visual scenarios for an exercise against student code.
 * Returns array of test results.
 */
export function runAllVisualScenarios(
  ExerciseClass: new () => VisualExercise,
  scenarios: VisualScenario[],
  studentCode: string,
  levelId: string,
  language: "jikiscript" | "javascript" | "python" = "jikiscript"
): ScenarioTestResult[] {
  return scenarios.map((scenario) => runVisualScenarioTest(ExerciseClass, scenario, studentCode, levelId, language));
}

/**
 * Runs all IO scenarios for an exercise against student code.
 * Returns array of test results.
 */
export function runAllIOScenarios(
  ExerciseClass: typeof IOExercise,
  scenarios: IOScenario[],
  studentCode: string,
  levelId: string,
  language: "jikiscript" | "javascript" | "python" = "jikiscript"
): ScenarioTestResult[] {
  return scenarios.map((scenario) => runIOScenarioTest(ExerciseClass, scenario, studentCode, levelId, language));
}

/**
 * Runs all scenarios for an exercise definition (includes levelId).
 * This is the recommended way to test exercises.
 * Automatically detects visual vs IO exercises and uses the appropriate test runner.
 */
export function runExerciseTests(
  exercise: ExerciseDefinition,
  studentCode: string,
  language: "jikiscript" | "javascript" | "python" = "jikiscript"
): ScenarioTestResult[] {
  if (exercise.type === "visual") {
    return runAllVisualScenarios(exercise.ExerciseClass, exercise.scenarios, studentCode, exercise.levelId, language);
  }
  return runAllIOScenarios(exercise.ExerciseClass, exercise.scenarios, studentCode, exercise.levelId, language);
}
