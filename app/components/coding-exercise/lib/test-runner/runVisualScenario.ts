import type { VisualExercise, VisualScenario, Language, InterpreterOptions } from "@jiki/curriculum";
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
  language: Language,
  interpreterOptions?: InterpreterOptions
): VisualTestResult {
  // Create fresh exercise instance
  const exercise = new ExerciseClass();

  // Run setup (if provided)
  scenario.setup?.(exercise);

  // Execute student code with selected interpreter
  const interpreter = getInterpreter(language);
  const interpreterContext = {
    externalFunctions: exercise.getExternalFunctions(language),
    languageFeatures: {
      timePerFrame: 1,
      ...interpreterOptions
    },
    randomSeed: scenario.randomSeed
  };

  const result = scenario.functionCall
    ? interpreter.evaluateFunction(
        studentCode,
        interpreterContext,
        interpreter.formatIdentifier(scenario.functionCall.name),
        ...scenario.functionCall.args
      )
    : interpreter.interpret(studentCode, interpreterContext);

  // Run expectations
  const expects = scenario.expectations(exercise);

  // Execute code checks if present - add results to expects array
  if (scenario.codeChecks && scenario.codeChecks.length > 0) {
    for (const check of scenario.codeChecks) {
      try {
        const checkPassed = check.pass(result, language);
        expects.push({
          pass: checkPassed,
          errorHtml: checkPassed ? undefined : check.errorHtml
        });
      } catch (error) {
        expects.push({
          pass: false,
          errorHtml: `Code check error: ${error instanceof Error ? error.message : String(error)}`
        });
      }
    }
  }

  // Build animation timeline
  // Frames already have time (microseconds) and timeInMs (milliseconds) from interpreter
  const frames = result.frames;

  // Always create animation timeline (required for scrubber)
  const animationTimeline = new AnimationTimelineClass({}).populateTimeline(exercise.animations, frames);

  // Animation timeline is ready for scrubber

  // Determine status - fail if any expectation fails OR if any frame has an error
  const hasFrameError = frames.some((f) => f.status === "ERROR");
  const status = expects.every((e) => e.pass) && !hasFrameError ? "pass" : "fail";

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
