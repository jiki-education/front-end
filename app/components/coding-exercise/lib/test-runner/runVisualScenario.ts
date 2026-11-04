import type {
  IsolatedCheck,
  Language,
  Messages as CurriculumMessages,
  VisualExercise,
  VisualScenario,
  VisualTestExpect
} from "@jiki/curriculum";
import { createTranslator } from "@jiki/curriculum";
import { resolveCodeCheckError } from "./resolveCodeCheckError";
import { editorMessage } from "../i18n/editorMessages";
import type { InterpretResult } from "@jiki/interpreters/shared";
import type { Messages as InterpreterMessages } from "@jiki/interpreters";
import { AnimationTimeline as AnimationTimelineClass } from "../AnimationTimeline";
import type { IsolatedRunResult, VisualTestResult } from "../test-results-types";
import { executeVisualStudentCode } from "./executeStudentCode";
import type { Interpreter } from "./getInterpreter";

export function runVisualScenario(
  scenario: VisualScenario,
  studentCode: string,
  ExerciseClass: new () => VisualExercise,
  language: Language,
  interpreter: Interpreter,
  languageFeatures: Record<string, any> | undefined,
  interpreterLocaleMessages: InterpreterMessages,
  exerciseLocaleMessages: CurriculumMessages
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
    interpreterLocaleMessages,
    exerciseLocaleMessages
  );

  const hasFrameError = primary.frames.some((f) => f.status === "ERROR");

  // When the student's code throws at runtime, the scenario's expectations are
  // meaningless (nothing was drawn), and surfacing them produces contradictory
  // messages like "The left brick isn't correct" alongside the real runtime error.
  // Suppress them and surface a single message pointing at the actual error on the
  // timeline, mirroring how runIsolatedCheck already behaves on a frame error.
  let expects: VisualTestExpect[];
  const isolatedRuns: IsolatedRunResult[] = [];
  if (hasFrameError) {
    expects = [{ pass: false, errorHtml: editorMessage("testResults.runtimeError") }];
  } else {
    const isolatedExpects: VisualTestExpect[] = (scenario.isolatedChecks ?? []).flatMap((check) => {
      const isolated = runIsolatedCheck(
        check,
        scenario,
        studentCode,
        ExerciseClass,
        language,
        interpreter,
        languageFeatures,
        resolvedSeed,
        interpreterLocaleMessages,
        exerciseLocaleMessages
      );
      if (isolated.run) {
        isolatedRuns.push(isolated.run);
      }
      return isolated.expects;
    });
    expects = [...primary.expects, ...isolatedExpects];
  }

  const allExpectsPass = expects.every((e) => e.pass) && !hasFrameError;
  const status = allExpectsPass ? (primary.lintErrors.length > 0 ? "lint_warning" : "pass") : "fail";

  // `exercise`, `result` and `isolatedRuns` are run artifacts for the
  // progression evaluator; the store and the UI never read them. A
  // runtime-errored scenario still carries its (halted) exercise instance -
  // partial progress is the signal.
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
    lintErrors: primary.lintErrors,
    exercise: primary.exercise,
    result: primary.result,
    isolatedRuns
  };
}

interface PrimaryCheckResult {
  exercise: VisualExercise;
  result: InterpretResult;
  expects: VisualTestExpect[];
  frames: InterpretResult["frames"];
  logLines: InterpretResult["logLines"];
  view: HTMLElement;
  animationTimeline: AnimationTimelineClass;
  lintErrors: NonNullable<InterpretResult["lintErrors"]>;
}

function runPrimaryCheck(
  scenario: VisualScenario,
  studentCode: string,
  ExerciseClass: new () => VisualExercise,
  language: Language,
  interpreter: Interpreter,
  languageFeatures: Record<string, any> | undefined,
  randomSeed: number | undefined,
  interpreterLocaleMessages: InterpreterMessages,
  exerciseLocaleMessages: CurriculumMessages
): PrimaryCheckResult {
  const { exercise, result } = executeVisualStudentCode(studentCode, {
    ExerciseClass,
    language,
    interpreter,
    languageFeatures,
    interpreterLocaleMessages,
    exerciseLocaleMessages,
    setup: scenario.setup,
    randomSeed,
    functionCall: scenario.functionCall
  });

  const expects = scenario.expectations(exercise);

  if (scenario.codeChecks && scenario.codeChecks.length > 0) {
    const t = createTranslator(exerciseLocaleMessages);
    for (const check of scenario.codeChecks) {
      try {
        const checkPassed = check.pass(result, language);
        expects.push({
          pass: checkPassed,
          errorHtml: checkPassed ? undefined : resolveCodeCheckError(check, t)
        });
      } catch (error) {
        expects.push({
          pass: false,
          errorHtml: editorMessage("testResults.codeCheckError", {
            message: error instanceof Error ? error.message : String(error)
          })
        });
      }
    }
  }

  const animationTimeline = new AnimationTimelineClass({}).populateTimeline(exercise.animations, result.frames);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- lintErrors may be undefined in test mocks
  const lintErrors = result.lintErrors ?? [];

  return {
    exercise,
    result,
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
  interpreterLocaleMessages: InterpreterMessages,
  exerciseLocaleMessages: CurriculumMessages
): { expects: VisualTestExpect[]; run?: IsolatedRunResult } {
  try {
    // `secretConstants` is the silent-constants hook: the interpreter seeds these in
    // global scope and no-ops any user declaration/assignment to those names. Isolated
    // checks inherit the scenario's canvas setup; only the silent constants differ.
    const { exercise, result } = executeVisualStudentCode(studentCode, {
      ExerciseClass,
      language,
      interpreter,
      languageFeatures,
      interpreterLocaleMessages,
      exerciseLocaleMessages,
      setup: scenario.setup,
      randomSeed,
      functionCall: scenario.functionCall,
      secretConstants: check.secretConstants
    });

    const checkExpects = check.expectations(exercise);
    const hasFrameError = result.frames.some((f) => f.status === "ERROR");

    const expects: VisualTestExpect[] = hasFrameError
      ? [{ pass: false, errorHtml: editorMessage("testResults.isolatedCheckError") }]
      : checkExpects;

    const run: IsolatedRunResult = {
      checkSlug: check.slug,
      passed: expects.every((e) => e.pass),
      exercise,
      result
    };
    return { expects, run };
  } catch (error) {
    return {
      expects: [
        {
          pass: false,
          errorHtml: editorMessage("testResults.isolatedCheckErrorDetail", {
            message: error instanceof Error ? error.message : String(error)
          })
        }
      ]
    };
  }
}
