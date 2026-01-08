import type { VisualExercise, VisualScenario, Language } from "@jiki/curriculum";
import { AnimationTimeline as AnimationTimelineClass } from "../AnimationTimeline";
import type { VisualTestResult } from "../test-results-types";
import { jikiscript, javascript, python } from "@jiki/interpreters";

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

export function runVisualScenario(
  scenario: VisualScenario,
  studentCode: string,
  ExerciseClass: new () => VisualExercise,
  language: Language
): VisualTestResult {
  // Create fresh exercise instance
  const exercise = new ExerciseClass();

  // Run setup (if provided)
  scenario.setup?.(exercise);

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
    type: "visual",
    slug: scenario.slug,
    name: scenario.name,
    status,
    expects,
    frames,
    logLines: result.logLines,
    codeRun: studentCode,
    view: exercise.getView(),
    animationTimeline
  };
}
