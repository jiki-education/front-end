import type { IsolatedCheck, Language, VisualExercise, VisualScenario, VisualTestExpect } from "@jiki/curriculum";
import type { InterpretResult } from "@jiki/interpreters/shared";
import type { Messages } from "@jiki/interpreters";
import { AnimationTimeline as AnimationTimelineClass } from "../AnimationTimeline";
import type { VisualTestResult } from "../test-results-types";
import type { Interpreter } from "./getInterpreter";

export function runVisualScenario(
  scenario: VisualScenario,
  studentCode: string,
  ExerciseClass: new () => VisualExercise,
  language: Language,
  interpreter: Interpreter,
  languageFeatures: Record<string, any> | undefined,
  localeMessages: Messages
): VisualTestResult {
  // Resolve seed once so the primary run and every isolated run share the same RNG stream.
  const resolvedSeed = scenario.randomSeed === true ? Math.floor(Math.random() * 2 ** 32) : scenario.randomSeed;

  const primary = runPrimaryCheck(
    scenario,
    studentCode,
    ExerciseClass,
    language,
    interpreter,
    languageFeatures,
    resolvedSeed,
    localeMessages
  );

  const hasFrameError = primary.frames.some((f) => f.status === "ERROR");

  // When the student's code throws at runtime, the scenario's expectations are
  // meaningless (nothing was drawn), and surfacing them produces contradictory
  // messages like "The left brick isn't correct" alongside the real runtime error.
  // Suppress them and surface a single message pointing at the actual error on the
  // timeline, mirroring how runIsolatedCheck already behaves on a frame error.
  let expects: VisualTestExpect[];
  if (hasFrameError) {
    expects = [
      {
        pass: false,
        errorHtml: "Your code hit an error while it was running. Fix the error message above to continue."
      }
    ];
  } else {
    const isolatedExpects: VisualTestExpect[] = (scenario.isolatedChecks ?? []).flatMap((check) =>
      runIsolatedCheck(
        check,
        scenario,
        studentCode,
        ExerciseClass,
        language,
        interpreter,
        languageFeatures,
        resolvedSeed,
        localeMessages
      )
    );
    expects = [...primary.expects, ...isolatedExpects];
  }

  const allExpectsPass = expects.every((e) => e.pass) && !hasFrameError;
  const status = allExpectsPass ? (primary.lintErrors.length > 0 ? "lint_warning" : "pass") : "fail";

  return {
    type: "visual",
    slug: scenario.slug,
    name: scenario.name,
    codeRun: studentCode,
    status,
    expects,
    frames: primary.frames,
    logLines: primary.logLines,
    view: primary.view,
    animationTimeline: primary.animationTimeline,
    lintErrors: primary.lintErrors
  };
}

interface PrimaryCheckResult {
  expects: VisualTestExpect[];
  frames: InterpretResult["frames"];
  logLines: InterpretResult["logLines"];
  view: HTMLElement;
  animationTimeline: AnimationTimelineClass;
  lintErrors: NonNullable<InterpretResult["lintErrors"]>;
}

// Creates a fresh Exercise, runs setup, executes the student's code, and returns both
// the exercise (for expectations / view) and the InterpretResult (for frames / logLines).
function executeStudentCode(
  scenario: VisualScenario,
  ExerciseClass: new () => VisualExercise,
  studentCode: string,
  language: Language,
  interpreter: Interpreter,
  languageFeatures: Record<string, any> | undefined,
  randomSeed: number | undefined,
  localeMessages: Messages,
  overrides?: { secretConstants?: Record<string, number | string | boolean> }
): { exercise: VisualExercise; result: InterpretResult } {
  const exercise = new ExerciseClass();
  exercise.randomSeed = randomSeed;

  scenario.setup?.(exercise);

  const interpreterContext = {
    externalFunctions: exercise.getExternalFunctions(language),
    classes: exercise.getExternalClasses(language),
    languageFeatures: languageFeatures ?? { timePerFrame: 1 },
    randomSeed,
    localeMessages,
    ...overrides
  };

  const result: InterpretResult = scenario.functionCall
    ? interpreter.evaluateFunction(
        studentCode,
        interpreterContext,
        interpreter.formatIdentifier(scenario.functionCall.name),
        ...scenario.functionCall.args
      )
    : interpreter.interpret(studentCode, interpreterContext);

  return { exercise, result };
}

function runPrimaryCheck(
  scenario: VisualScenario,
  studentCode: string,
  ExerciseClass: new () => VisualExercise,
  language: Language,
  interpreter: Interpreter,
  languageFeatures: Record<string, any> | undefined,
  randomSeed: number | undefined,
  localeMessages: Messages
): PrimaryCheckResult {
  const { exercise, result } = executeStudentCode(
    scenario,
    ExerciseClass,
    studentCode,
    language,
    interpreter,
    languageFeatures,
    randomSeed,
    localeMessages
  );

  const expects = scenario.expectations(exercise);

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

  const animationTimeline = new AnimationTimelineClass({}).populateTimeline(exercise.animations, result.frames);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- lintErrors may be undefined in test mocks
  const lintErrors = result.lintErrors ?? [];

  return {
    expects,
    frames: result.frames,
    logLines: result.logLines,
    view: exercise.getView(),
    animationTimeline,
    lintErrors
  };
}

function runIsolatedCheck(
  check: IsolatedCheck,
  scenario: VisualScenario,
  studentCode: string,
  ExerciseClass: new () => VisualExercise,
  language: Language,
  interpreter: Interpreter,
  languageFeatures: Record<string, any> | undefined,
  randomSeed: number | undefined,
  localeMessages: Messages
): VisualTestExpect[] {
  try {
    // `secretConstants` is the silent-constants hook: the interpreter seeds these in
    // global scope and no-ops any user declaration/assignment to those names. Isolated
    // checks inherit the scenario's canvas setup; only the silent constants differ.
    const { exercise, result } = executeStudentCode(
      scenario,
      ExerciseClass,
      studentCode,
      language,
      interpreter,
      languageFeatures,
      randomSeed,
      localeMessages,
      { secretConstants: check.secretConstants }
    );

    const checkExpects = check.expectations(exercise);
    const hasFrameError = result.frames.some((f) => f.status === "ERROR");

    if (hasFrameError) {
      return [{ pass: false, errorHtml: "Your code threw an error while running." }];
    }
    return checkExpects;
  } catch (error) {
    return [
      {
        pass: false,
        errorHtml: `Your code threw an error while running. (${error instanceof Error ? error.message : String(error)})`
      }
    ];
  }
}
