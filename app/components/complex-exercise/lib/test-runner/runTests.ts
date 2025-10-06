import type { Exercise, ExerciseDefinition, Scenario } from "@jiki/curriculum";
import { jikiscript, javascript, python } from "@jiki/interpreters";
import { AnimationTimeline as AnimationTimelineClass } from "../AnimationTimeline";
import type { TestResult, TestSuiteResult } from "../test-results-types";

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

function runScenario(
  scenario: Scenario,
  studentCode: string,
  ExerciseClass: new () => Exercise,
  language: Language
): TestResult {
  // Create fresh exercise instance
  const exercise = new ExerciseClass();

  // Run setup
  scenario.setup(exercise);

  // Execute student code with selected interpreter
  const interpreter = getInterpreter(language);
  const result = interpreter.interpret(studentCode, {
    externalFunctions: exercise.availableFunctions.map((func) => ({
      name: func.name,
      func: func.func
    })) as any,
    languageFeatures: {
      timePerFrame: 1,
      maxTotalLoopIterations: 1000
    }
  });

  // Run expectations
  const expects = scenario.expectations(exercise);

  // Build animation timeline
  // Frames already have time (microseconds) and timeInMs (milliseconds) from interpreter
  const frames = result.frames;

  // Always create animation timeline (required for scrubber)
  const animationTimeline = new AnimationTimelineClass({}).populateTimeline(exercise.animations, frames);

  // Animation timeline is ready for scrubber

  // Determine status
  const status = expects.every((e) => e.pass) ? "pass" : "fail";

  return {
    slug: scenario.slug,
    name: scenario.name,
    status,
    expects,
    frames,
    codeRun: studentCode,
    view: exercise.getView(),
    animationTimeline
  };
}

export function runTests(studentCode: string, exercise: ExerciseDefinition, language: Language): TestSuiteResult {
  // Create a temporary exercise to get external functions
  const tempExercise = new exercise.ExerciseClass();

  // Compile ONCE before running any scenarios
  const interpreter = getInterpreter(language);
  const compilationResult = interpreter.compile(studentCode, {
    externalFunctions: tempExercise.availableFunctions.map((func) => ({
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

  // Compilation succeeded, run all scenarios with interpret()
  const tests: TestResult[] = [];
  for (const scenario of exercise.scenarios) {
    const result = runScenario(scenario, studentCode, exercise.ExerciseClass, language);
    tests.push(result);
  }

  // Determine overall status
  const status = tests.every((t) => t.status === "pass") ? "pass" : "fail";

  const result: TestSuiteResult = {
    tests,
    status
  };

  return result;
}
