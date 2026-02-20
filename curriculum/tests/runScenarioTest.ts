import { jikiscript, javascript, python } from "@jiki/interpreters";
import type { InterpretResult } from "@jiki/interpreters";
import type { IOExercise } from "../src/IOExercise";
import type { VisualExercise } from "../src/VisualExercise";
import type {
  VisualScenario,
  IOScenario,
  TestExpect,
  CodeCheckExpect,
  ExerciseDefinition,
  InterpreterOptions
} from "../src/exercises/types";
import { getLanguageFeatures } from "../src/levels";
import type { Language } from "../src/types";

/**
 * Helper to get the appropriate interpreter for a language
 */
function getInterpreter(language: Language) {
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
  language: Language = "jikiscript",
  interpreterOptions?: InterpreterOptions
): ScenarioTestResult {
  // Create fresh exercise instance
  const exercise = new ExerciseClass();

  // Run setup to initialize exercise state
  scenario.setup?.(exercise);

  // Get language features for this level
  const languageFeatures = getLanguageFeatures(levelId, language);

  // Execute student code with the exercise's available functions
  // Note: stdlib functions are automatically added by the interpreter based on languageFeatures.allowedStdlibFunctions
  const interpreter = getInterpreter(language);
  const interpreterContext = {
    externalFunctions: exercise.getExternalFunctions(language),
    languageFeatures: {
      timePerFrame: 1,
      maxTotalLoopIterations: 10000,
      ...languageFeatures,
      ...interpreterOptions
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    randomSeed: scenario.randomSeed
  };

  if (scenario.functionCall) {
    const evaluationResult = interpreter.evaluateFunction(
      studentCode,
      interpreterContext,
      interpreter.formatIdentifier(scenario.functionCall.name),
      ...scenario.functionCall.args
    );
    // console.log(evaluationResult)
    // console.log(evaluationResult.error)
    // console.log(evaluationResult.frames[4]?.error)
  } else {
    const evaluationResult = interpreter.interpret(studentCode, interpreterContext);
    console.log(evaluationResult);
    console.log(evaluationResult.error);
    console.log(evaluationResult.frames[0]?.error);
  }

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
  language: Language = "jikiscript",
  interpreterOptions?: InterpreterOptions
): ScenarioTestResult {
  // Get language features for this level
  const languageFeatures = getLanguageFeatures(levelId, language);

  // Get available helper functions from the exercise class
  // Note: stdlib functions are automatically added by the interpreter based on languageFeatures.allowedStdlibFunctions
  const externalFunctions = ExerciseClass.getExternalFunctions(language);

  // Call the student's function using evaluateFunction
  const interpreter = getInterpreter(language);
  const evaluationResult = interpreter.evaluateFunction(
    studentCode,
    {
      externalFunctions,
      languageFeatures: {
        timePerFrame: 1,
        maxTotalLoopIterations: 10000,
        ...languageFeatures,
        ...interpreterOptions
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any
    },
    interpreter.formatIdentifier(scenario.functionName),
    ...scenario.args
  );
  // console.log(evaluationResult);
  // console.log(evaluationResult.error);
  // console.log(evaluationResult.frames[2]?.error);

  // Compare actual vs expected using the matcher
  const matcher = scenario.matcher ?? "toEqual";
  let pass = false;

  if (evaluationResult.error) {
    pass = false;
  } else {
    switch (matcher) {
      case "toBe":
        pass = evaluationResult.value === scenario.expected;
        break;
      case "toEqual":
        // Deep equality comparison
        pass = JSON.stringify(evaluationResult.value) === JSON.stringify(scenario.expected);
        break;
      case "toBeGreaterThan":
        pass = evaluationResult.value > scenario.expected;
        break;
      case "toBeLessThan":
        pass = evaluationResult.value < scenario.expected;
        break;
    }
  }

  // Execute code checks if present
  let codeCheckResults: CodeCheckExpect[] | undefined;
  let allCodeChecksPassed = true;

  if (scenario.codeChecks && scenario.codeChecks.length > 0) {
    codeCheckResults = scenario.codeChecks.map((check) => {
      try {
        const checkPassed = check.pass(evaluationResult as InterpretResult, language);
        if (!checkPassed) allCodeChecksPassed = false;

        return {
          pass: checkPassed,
          errorHtml: checkPassed ? undefined : check.errorHtml
        };
      } catch (error) {
        // If check throws error, treat as failure
        allCodeChecksPassed = false;
        return {
          pass: false,
          errorHtml: `Code check error: ${error instanceof Error ? error.message : String(error)}`
        };
      }
    });
  }

  // Update overall pass to include code checks
  const overallPass = pass && allCodeChecksPassed;

  // Build TestExpect (note: this is for curriculum testing, not app testing)
  // The app's test runner creates proper IOTestExpect with diff
  const expects: TestExpect[] = [
    {
      pass: overallPass,
      errorHtml: !overallPass
        ? `Expected ${scenario.functionName}(${scenario.args.map((a) => JSON.stringify(a)).join(", ")}) to return ${JSON.stringify(scenario.expected)}, but got ${evaluationResult.error ? "error" : JSON.stringify(evaluationResult.value)}`
        : "",
      codeCheckResults
    }
  ];

  return {
    slug: scenario.slug,
    name: scenario.name,
    status: overallPass ? "pass" : "fail",
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
  language: Language = "jikiscript",
  interpreterOptions?: InterpreterOptions
): ScenarioTestResult[] {
  return scenarios.map((scenario) =>
    runVisualScenarioTest(ExerciseClass, scenario, studentCode, levelId, language, interpreterOptions)
  );
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
  language: Language = "jikiscript",
  interpreterOptions?: InterpreterOptions
): ScenarioTestResult[] {
  return scenarios.map((scenario) =>
    runIOScenarioTest(ExerciseClass, scenario, studentCode, levelId, language, interpreterOptions)
  );
}

/**
 * Runs all scenarios for an exercise definition (includes levelId).
 * This is the recommended way to test exercises.
 * Automatically detects visual vs IO exercises and uses the appropriate test runner.
 */
export function runExerciseTests(
  exercise: ExerciseDefinition,
  studentCode: string,
  language: Language = "jikiscript"
): ScenarioTestResult[] {
  if (exercise.type === "visual") {
    return runAllVisualScenarios(
      exercise.ExerciseClass,
      exercise.scenarios,
      studentCode,
      exercise.levelId,
      language,
      exercise.interpreterOptions
    );
  }
  return runAllIOScenarios(
    exercise.ExerciseClass,
    exercise.scenarios,
    studentCode,
    exercise.levelId,
    language,
    exercise.interpreterOptions
  );
}
