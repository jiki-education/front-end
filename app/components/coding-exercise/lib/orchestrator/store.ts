import { markChallengeComplete } from "@/lib/api/challenges";
import { markLessonComplete } from "@/lib/api/lessons";
import { showModal } from "@/lib/modal";
import { showLessonSaveErrorToast } from "@/lib/toasts/lessonSaveError";
import type { ExerciseDefinition, Language, ReadonlyRange } from "@jiki/curriculum";
import { TIME_SCALE_FACTOR } from "@jiki/interpreters/shared";
import { useStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import { createStore, type StoreApi } from "zustand/vanilla";
import { ERROR_HIGHLIGHT_COLOR, INFO_HIGHLIGHT_COLOR } from "../../ui/codemirror/extensions/lineHighlighter";
import { processMessageContent } from "../../ui/messageUtils";
import {
  bonusScenarioSlugs,
  countOutstandingBonusTasks,
  firstFailingBonusScenario,
  firstOutstandingBonusTaskId
} from "../bonusScenarios";
import { loadCodeMirrorContent } from "../localStorage";
import type { TestResult, TestSuiteResult } from "../test-results-types";
import type { ExerciseContext, OrchestratorState, OrchestratorStore } from "../types";
import { BreakpointManager } from "./BreakpointManager";
import { TimelineManager } from "./TimelineManager";

const ONE_MINUTE = 60 * 1000;

// `excludeSlugs` narrows the pool of scenarios eligible for auto-selection. It's
// used at the completion moment to keep the celebratory spotlight off outstanding
// bonus scenarios (which are still failing) - we want to land on a passing
// required scenario instead. When the student is later working on a bonus, no
// exclusion is passed, so the failing bonus they're on is selected as normal.
export function getTestToInspect(
  tests: TestResult[],
  currentTest: TestResult | null,
  excludeSlugs?: Set<string>
): TestResult {
  const pool = excludeSlugs && excludeSlugs.size > 0 ? tests.filter((t) => !excludeSlugs.has(t.slug)) : tests;
  // Fall back to the full suite if exclusion emptied the pool (e.g. all bonus).
  const eligible = pool.length > 0 ? pool : tests;

  if (currentTest) {
    const updatedCurrent = eligible.find((t) => t.slug === currentTest.slug);
    if (updatedCurrent && updatedCurrent.status === "fail") {
      return updatedCurrent;
    }
  }

  const firstFailing = eligible.find((t) => t.status === "fail");
  if (firstFailing) return firstFailing;

  return eligible[eligible.length - 1];
}

// The spotlight dims the page around the exercise and is only ever cleared when
// the inspected test's animation timeline finishes (its onComplete callback,
// which also shows the completion modal). So it should only be shown when the
// suite passes, the exercise isn't already complete, and the inspected test
// actually has an animation that will play and then clear it.
//
// Tests with no animation to play would otherwise leave the spotlight stuck on
// forever: IO suites (no timeline at all) and visual scenarios that produce no
// animations (e.g. bouncer's "rejected" scenarios, where the correct outcome is
// to do nothing). For those, the caller must trigger completion directly.
export function shouldShowSpotlight(
  result: TestSuiteResult | null,
  inspectedTest: TestResult | undefined,
  isExerciseCompleted: boolean
): boolean {
  return Boolean(result?.passed) && !isExerciseCompleted && (inspectedTest?.animationTimeline?.duration ?? 0) > 0;
}

// Factory function to create an instance-specific store
export function createOrchestratorStore(
  exercise: ExerciseDefinition,
  language: Language,
  context: ExerciseContext,
  onGoToDashboard?: () => void
): StoreApi<OrchestratorStore> {
  return createStore<OrchestratorStore>()(
    subscribeWithSelector((set, get) => {
      const showCompletionModalIfReady = () => {
        const state = get();
        if (!state.testSuiteResult?.passed || state.isExerciseCompleted) {
          return;
        }

        // Bonus tasks are optional, so completion can be reached with them still
        // outstanding. Surface how many remain so the modal can nudge toward them.
        const result = state.testSuiteResult;
        const outstandingBonusCount = countOutstandingBonusTasks(exercise, result);
        const firstBonusTaskId = firstOutstandingBonusTaskId(exercise, result);
        const firstFailingBonusTest = firstFailingBonusScenario(exercise, result);

        showModal("exercise-completion-modal", {
          exerciseTitle: state.exerciseTitle,
          exerciseSlug: state.exerciseSlug,
          isChallenge: state.context.type === "challenge",
          initialStep: "success",
          outstandingBonusCount,
          onSolveBonuses: () => {
            // The modal is closed by the modal hook; here we focus the first
            // outstanding bonus task and shift the scenario view to its first
            // failing scenario so the student lands on the bonus to tackle.
            if (firstBonusTaskId) {
              get().setCurrentTaskId(firstBonusTaskId);
            }
            if (firstFailingBonusTest) {
              get().setCurrentTest(firstFailingBonusTest);
            }
          },
          onGoToDashboard,
          onCompleteExercise: async () => {
            try {
              const response =
                state.context.type === "challenge"
                  ? await markChallengeComplete(state.context.slug)
                  : await markLessonComplete(state.context.slug);
              const events = response?.meta?.events || [];
              get().setCompletionResponse(events);
              get().setIsExerciseCompleted(true);
              return events;
            } catch (error) {
              console.error("Failed to mark exercise as complete:", error);
              showLessonSaveErrorToast();
              return [];
            }
          }
        });
        state.setIsSpotlightActive(false);
      };

      return {
        exerciseSlug: exercise.slug,
        context,
        exerciseTitle: exercise.title,
        code: exercise.stubs[language],
        output: "",
        status: "idle",
        error: null,
        currentTest: null,
        currentTestIdx: 0,
        hasCodeBeenEdited: false,
        isSpotlightActive: false,
        isExerciseCompleted: false,
        completionResponse: [],
        foldedLines: [],
        language: language,

        // Editor store state
        readonly: false,
        shouldShowInformationWidget: false,
        underlineRange: undefined,
        highlightedLineColor: "",
        highlightedLine: 0,
        informationWidgetData: { html: "", line: 0, status: "SUCCESS" },
        breakpoints: [],
        shouldAutoRunCode: false,

        // Error store state
        hasUnhandledError: false,
        unhandledErrorBase64: "",
        hasSyntaxError: false,

        // Editor handler state
        latestValueSnapshot: undefined as string | undefined,

        // Test results state
        testSuiteResult: null,
        shouldPlayOnTestChange: true,

        // Frame navigation state (moved from currentTest to top level)
        prevFrame: undefined,
        nextFrame: undefined,
        prevBreakpointFrame: undefined,
        nextBreakpointFrame: undefined,

        // Test time persistence - maps test slugs to their current time positions
        testCurrentTimes: {},

        // Current test time - extracted from currentTest to prevent rerenders
        currentTestTime: 0,

        // Current frame - extracted from currentTest to prevent rerenders
        currentFrame: undefined,

        // Play/pause state
        isPlaying: false,

        // Lint errors
        lintErrors: [],

        // Task management state
        taskProgress: new Map(),
        completedTasks: new Set(),
        currentTaskId: null,

        // Private actions - not exposed to components
        recalculateNavigationFrames: () => {
          const state = get();
          if (!state.currentTest || !state.currentFrame) {
            set({
              prevFrame: undefined,
              nextFrame: undefined
            });
            return;
          }

          const prevFrame = TimelineManager.findPrevFrame(
            state.currentTest.frames,
            state.currentFrame,
            state.foldedLines
          );
          const nextFrame = TimelineManager.findNextFrame(
            state.currentTest.frames,
            state.currentFrame,
            state.foldedLines
          );

          set({
            prevFrame,
            nextFrame
          });
        },
        recalculateBreakpointFrames: () => {
          const state = get();
          if (!state.currentTest) {
            set({
              prevBreakpointFrame: undefined,
              nextBreakpointFrame: undefined
            });
            return;
          }

          const prevBreakpointFrame = BreakpointManager.findPrevBreakpointFrame(
            state.currentFrame,
            state.currentTest.frames,
            state.breakpoints,
            state.foldedLines
          );
          const nextBreakpointFrame = BreakpointManager.findNextBreakpointFrame(
            state.currentFrame,
            state.currentTest.frames,
            state.breakpoints,
            state.foldedLines
          );

          set({
            prevBreakpointFrame,
            nextBreakpointFrame
          });
        },
        setCode: (code) => set({ code, hasCodeBeenEdited: true }),
        setExerciseTitle: (title) => set({ exerciseTitle: title }),
        setOutput: (output) => set({ output }),
        setStatus: (status) => set({ status }),
        setError: (error) => set({ error }),
        setLanguage: (language) => set({ language }),
        setCurrentTest: (test) => {
          const state = get();

          // Early return if setting the same test
          if (test === state.currentTest) {
            return;
          }

          const oldTest = state.currentTest;

          // Clean up old test's animation timeline callbacks (visual tests only)
          oldTest?.animationTimeline?.clearUpdateCallbacks();
          oldTest?.animationTimeline?.clearCompleteCallbacks();

          if (!test) {
            set({
              currentTest: test,
              currentTestIdx: 0,
              currentTestTime: 0,
              currentFrame: undefined,
              highlightedLine: 0
            });
            return;
          }

          // Find the index of this test in the test suite
          const testIdx = state.testSuiteResult?.tests.findIndex((t) => t.slug === test.slug) ?? 0;

          // Check if we have a saved time for this test
          const savedTime = state.testCurrentTimes[test.slug];
          let timeToUse = savedTime !== undefined ? savedTime : (test.frames.at(0)?.time ?? 0);

          set({
            currentTest: test,
            currentTestIdx: testIdx,
            currentFrame: undefined,
            highlightedLine: 0,
            isPlaying: false
          });

          // Set up animation timeline callbacks (visual tests only)
          test.animationTimeline?.onUpdate((anim) => {
            // Convert from milliseconds to microseconds
            get().setCurrentTestTime(anim.currentTime * TIME_SCALE_FACTOR, "nearest");
          });

          test.animationTimeline?.onComplete(() => {
            const state = get();
            state.setIsPlaying(false);

            // If the last frame is an error, show the information widget
            const lastFrame = test.frames[test.frames.length - 1];
            // ESLint doesn't realize lastFrame can be undefined when frames array is empty
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (lastFrame?.status === "ERROR") {
              state.setShouldShowInformationWidget(true);
            }

            showCompletionModalIfReady();
          });

          const errorFrame = test.frames.find((frame) => frame.status === "ERROR");
          const shouldAutoPlay = state.shouldPlayOnTestChange && (test.animationTimeline?.duration ?? 0) > 0;

          if (errorFrame && !shouldAutoPlay) {
            // Not auto-playing: jump directly to error (or breakpoint before it)
            get().setShouldShowInformationWidget(true);

            const breakpointFrame = BreakpointManager.findPrevBreakpointFrame(
              errorFrame,
              test.frames,
              state.breakpoints,
              state.foldedLines
            );
            timeToUse = breakpointFrame ? breakpointFrame.time : errorFrame.time;
          }

          // Trigger frame calculations with the restored/initial time
          get().setCurrentTestTime(timeToUse, "nearest", true);

          if (shouldAutoPlay) {
            get().setIsPlaying(true);
          }
        },

        setCurrentTestIdx: (idx) => {
          const state = get();

          // Always update the index (works for both preview and test results mode)
          set({ currentTestIdx: idx });

          // If we have test results, also update currentTest to match
          if (state.testSuiteResult && state.testSuiteResult.tests[idx]) {
            get().setCurrentTest(state.testSuiteResult.tests[idx]);
          }
        },

        setCurrentTestTime: (
          time: number,
          nearestOrExactFrame: "nearest" | "exact" = "exact",
          force: boolean = false
        ) => {
          if (get().currentTestTime === time && !force) {
            return;
          }

          const state = get();
          if (!state.currentTest) {
            return;
          }

          // Update timeline time and persist it for this test
          set({
            currentTestTime: time,
            testCurrentTimes: {
              ...state.testCurrentTimes,
              [state.currentTest.slug]: time
            }
          });

          // Normally we only want to update this if we land on an exact
          // frame, but on loading a new test, we want to just get any frame so we have one.
          const frame =
            nearestOrExactFrame === "nearest"
              ? TimelineManager.findNearestFrame(state.currentTest.frames, time, state.foldedLines)
              : state.currentTest.frames.find((f) => f.time === time);
          if (frame) {
            get().setCurrentFrame(frame);
          }
        },

        setCurrentFrame: (frame) => {
          const state = get();
          if (!state.currentTest) {
            return;
          }

          const rawContent = frame.status === "SUCCESS" ? frame.generateDescription() : (frame.error?.message ?? "");
          const infoWidgetHtml = processMessageContent(rawContent);

          // Runtime error frames highlight the line in red (cm-highlightedLine--error);
          // success frames use the default info styling. Unlike syntax errors, runtime
          // error frames do NOT underline a specific location.
          const isError = frame.status === "ERROR";

          set({
            currentFrame: frame,
            highlightedLine: frame.line,
            highlightedLineColor: isError ? ERROR_HIGHLIGHT_COLOR : INFO_HIGHLIGHT_COLOR,
            underlineRange: undefined,
            // Update information widget data whenever frame changes
            informationWidgetData: {
              html: infoWidgetHtml,
              line: frame.line,
              status: frame.status
            }
          });

          // Recalculate both navigation and breakpoint frames after updating current frame
          get().recalculateNavigationFrames();
          get().recalculateBreakpointFrames();
        },
        setHasCodeBeenEdited: (value) => set({ hasCodeBeenEdited: value }),
        setIsSpotlightActive: (value) => set({ isSpotlightActive: value }),
        setIsExerciseCompleted: (value) => set({ isExerciseCompleted: value }),
        setCompletionResponse: (response) => set({ completionResponse: response }),
        setFoldedLines: (lines) => {
          set({ foldedLines: lines });

          // Recalculate frames that are affected by folded lines
          get().recalculateNavigationFrames();
          get().recalculateBreakpointFrames();
        },

        // Editor store actions
        setReadonly: (readonly) => set({ readonly }),
        setShouldShowInformationWidget: (show) => set({ shouldShowInformationWidget: show }),
        setUnderlineRange: (range) => set({ underlineRange: range }),
        setHighlightedLineColor: (color) => set({ highlightedLineColor: color }),
        setHighlightedLine: (line) => set({ highlightedLine: line }),
        setInformationWidgetData: (data) => set({ informationWidgetData: data }),
        setBreakpoints: (breakpoints) => {
          set({ breakpoints });

          // Recalculate breakpoint frames
          get().recalculateBreakpointFrames();
        },
        setShouldAutoRunCode: (shouldAutoRun) => set({ shouldAutoRunCode: shouldAutoRun }),

        // Error store actions
        setHasUnhandledError: (hasError) => set({ hasUnhandledError: hasError }),
        setUnhandledErrorBase64: (errorData) => set({ unhandledErrorBase64: errorData }),
        setHasSyntaxError: (hasError) => set({ hasSyntaxError: hasError }),

        // Editor handler actions
        setLatestValueSnapshot: (value) => set({ latestValueSnapshot: value }),

        // Test results actions
        setTestSuiteResult: (result) => {
          const state = get();

          // Select the best test to inspect: stay on current if still failing,
          // otherwise first failing, otherwise last test (all pass).
          //
          // At the completion moment (required scenarios pass, exercise not yet
          // completed) a still-failing bonus scenario would otherwise be picked
          // as the "first failing" test and get the celebratory spotlight. Exclude
          // bonus scenarios from the selection so we land on a passing required
          // one. Once the exercise is completed and the student is working on the
          // bonus, no exclusion applies, so the bonus they're on is selected.
          const excludeSlugs = result?.passed && !state.isExerciseCompleted ? bonusScenarioSlugs(exercise) : undefined;
          const testToInspect =
            result && result.tests.length > 0
              ? getTestToInspect(result.tests, state.currentTest, excludeSlugs)
              : undefined;

          // Set the test suite result and reset things.
          set({
            testSuiteResult: result,
            shouldPlayOnTestChange: true,
            hasCodeBeenEdited: false,
            status: "success", // This will get reset via the setCurrentTest below.
            testCurrentTimes: {},
            isSpotlightActive: shouldShowSpotlight(result, testToInspect, state.isExerciseCompleted),
            // Reset playing state to allow animations to play on new test suite
            isPlaying: false
          });

          if (testToInspect) {
            get().setCurrentTest(testToInspect);
            set({ lintErrors: testToInspect.lintErrors });
          }

          // The completion modal (and spotlight clear) is normally triggered when
          // the inspected animation finishes (its onComplete). When the inspected
          // passing test has no animation to play, onComplete never fires, so
          // trigger completion directly. Covers IO suites and animation-less
          // visual scenarios (e.g. bouncer's "rejected" cases).
          if (result?.passed && !shouldShowSpotlight(result, testToInspect, state.isExerciseCompleted)) {
            showCompletionModalIfReady();
          }
        },
        setShouldPlayOnTestChange: (shouldAutoPlay) => set({ shouldPlayOnTestChange: shouldAutoPlay }),
        setIsPlaying: (playing) => {
          const state = get();

          // Early return if state hasn't changed
          if (state.isPlaying === playing) {
            return;
          }

          if (!state.currentTest) {
            return;
          }

          // If trying to set playing to true but animation is completed, don't start
          // User must explicitly click play button (which calls orchestrator.play() and resets time) to restart
          if (playing && state.currentTest.animationTimeline?.completed) {
            return;
          }

          set({ isPlaying: playing });

          if (playing) {
            // Hide information widget when playing
            state.setShouldShowInformationWidget(false);
            // Start the animation timeline (visual tests only)
            state.currentTest.animationTimeline?.play();
          } else {
            // Pause the animation timeline (visual tests only)
            state.currentTest.animationTimeline?.pause();
          }
        },

        // Exercise data initialization with priority logic
        initializeExerciseData: (serverData?: {
          code: string;
          storedAt?: string;
          readonlyRanges?: ReadonlyRange[];
        }) => {
          const state = get();
          const localStorageResult = loadCodeMirrorContent(state.exerciseSlug);

          // Rule 1: No server data and no localStorage - use stub code (already set during store creation)
          if (!serverData && (!localStorageResult.success || !localStorageResult.data)) {
            return;
          }

          // Rule 2: No server data but localStorage exists - use localStorage
          if (!serverData && localStorageResult.success && localStorageResult.data) {
            set({ code: localStorageResult.data.code });
            return;
          }

          // Rule 3: Server data exists, check against localStorage
          if (serverData) {
            // No localStorage - use server data
            if (!localStorageResult.success || !localStorageResult.data) {
              set({ code: serverData.code });
              return;
            }

            // Both exist - compare timestamps
            const localStorageData = localStorageResult.data;

            // If server has no timestamp, use localStorage
            if (!serverData.storedAt) {
              set({ code: localStorageData.code });
              return;
            }

            // Compare timestamps - server data must be newer by at least 1 minute
            const serverTime = new Date(serverData.storedAt).getTime();
            const localTime = new Date(localStorageData.storedAt).getTime();

            // Check for invalid timestamps (NaN)
            const serverTimeValid = !isNaN(serverTime);
            const localTimeValid = !isNaN(localTime);

            // If both timestamps are invalid, use localStorage (safer default)
            if (!serverTimeValid && !localTimeValid) {
              set({ code: localStorageData.code });
              return;
            }

            // If only server timestamp is invalid, use localStorage
            if (!serverTimeValid && localTimeValid) {
              set({ code: localStorageData.code });
              return;
            }

            // If only localStorage timestamp is invalid, use server
            if (serverTimeValid && !localTimeValid) {
              set({ code: serverData.code });
              return;
            }

            // Both timestamps are valid - compare them
            if (serverTime > localTime + ONE_MINUTE) {
              // Server is newer - use server data
              set({ code: serverData.code });
            } else {
              // localStorage is newer or equal - use localStorage
              set({ code: localStorageData.code });
            }
          }
        },

        // Lint errors action
        setLintErrors: (lintErrors) => set({ lintErrors }),

        // Task management actions
        setTaskProgress: (taskProgress) => set({ taskProgress }),
        setCompletedTasks: (completedTasks) => set({ completedTasks }),
        setCurrentTaskId: (currentTaskId) => set({ currentTaskId }),

        reset: () =>
          set({
            code: exercise.stubs[language],
            exerciseTitle: exercise.title,
            output: "",
            status: "idle",
            error: null,
            currentTest: null,
            currentTestIdx: 0,
            hasCodeBeenEdited: false,
            isSpotlightActive: false,
            foldedLines: [],
            language: language,

            // Reset editor store state
            readonly: false,
            shouldShowInformationWidget: false,
            underlineRange: undefined,
            highlightedLineColor: "",
            highlightedLine: 0,
            informationWidgetData: { html: "", line: 0, status: "SUCCESS" },
            breakpoints: [],
            shouldAutoRunCode: false,

            // Reset error store state
            hasUnhandledError: false,
            unhandledErrorBase64: "",
            hasSyntaxError: false,

            // Reset editor handler state
            latestValueSnapshot: undefined,

            // Reset test results state
            testSuiteResult: null,
            shouldPlayOnTestChange: true,

            // Reset frame navigation state
            prevFrame: undefined,
            nextFrame: undefined,
            prevBreakpointFrame: undefined,
            nextBreakpointFrame: undefined,

            // Reset current test time and frame
            currentTestTime: 0,
            currentFrame: undefined,

            // Reset play/pause state
            isPlaying: false,

            // Reset lint errors
            lintErrors: [],

            // Reset task management state
            taskProgress: new Map(),
            completedTasks: new Set(),
            currentTaskId: null
          })
      };
    })
  );
}

// Hook to use with an orchestrator instance
export function useOrchestratorStore(orchestrator: { getStore: () => StoreApi<OrchestratorStore> }): OrchestratorState {
  return useStore(
    orchestrator.getStore(),
    useShallow((state) => ({
      exerciseSlug: state.exerciseSlug,
      context: state.context,
      exerciseTitle: state.exerciseTitle,
      code: state.code,
      output: state.output,
      status: state.status,
      error: state.error,
      currentTest: state.currentTest,
      currentTestIdx: state.currentTestIdx,
      hasCodeBeenEdited: state.hasCodeBeenEdited,
      isSpotlightActive: state.isSpotlightActive,
      isExerciseCompleted: state.isExerciseCompleted,
      completionResponse: state.completionResponse,
      foldedLines: state.foldedLines,
      language: state.language,

      // Editor store state
      readonly: state.readonly,
      shouldShowInformationWidget: state.shouldShowInformationWidget,
      underlineRange: state.underlineRange,
      highlightedLineColor: state.highlightedLineColor,
      highlightedLine: state.highlightedLine,
      informationWidgetData: state.informationWidgetData,
      breakpoints: state.breakpoints,
      shouldAutoRunCode: state.shouldAutoRunCode,

      // Error store state
      hasUnhandledError: state.hasUnhandledError,
      unhandledErrorBase64: state.unhandledErrorBase64,
      hasSyntaxError: state.hasSyntaxError,

      // Editor handler state
      latestValueSnapshot: state.latestValueSnapshot,

      // Test results state
      testSuiteResult: state.testSuiteResult,
      shouldPlayOnTestChange: state.shouldPlayOnTestChange,

      // Frame navigation state
      prevFrame: state.prevFrame,
      nextFrame: state.nextFrame,
      prevBreakpointFrame: state.prevBreakpointFrame,
      nextBreakpointFrame: state.nextBreakpointFrame,

      // Test time persistence
      testCurrentTimes: state.testCurrentTimes,

      // Current test time
      currentTestTime: state.currentTestTime,

      // Current frame
      currentFrame: state.currentFrame,

      // Play/pause state
      isPlaying: state.isPlaying,

      // Lint errors
      lintErrors: state.lintErrors,

      // Task management state
      taskProgress: state.taskProgress,
      completedTasks: state.completedTasks,
      currentTaskId: state.currentTaskId
    }))
  );
}
