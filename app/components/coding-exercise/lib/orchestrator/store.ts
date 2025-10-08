import { TIME_SCALE_FACTOR } from "@jiki/interpreters";
import { useStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import { createStore, type StoreApi } from "zustand/vanilla";
import { showModal } from "@/lib/modal";
import { loadCodeMirrorContent } from "../localStorage";
import type { OrchestratorState, OrchestratorStore } from "../types";
import { BreakpointManager } from "./BreakpointManager";
import { TimelineManager } from "./TimelineManager";

const ONE_MINUTE = 60 * 1000;

// Factory function to create an instance-specific store
export function createOrchestratorStore(exerciseUuid: string, initialCode: string): StoreApi<OrchestratorStore> {
  return createStore<OrchestratorStore>()(
    subscribeWithSelector((set, get) => ({
      exerciseUuid,
      exerciseTitle: "Greeting Function Exercise", // Default title
      code: initialCode,
      output: "",
      status: "idle",
      error: null,
      currentTest: null,
      hasCodeBeenEdited: false,
      isSpotlightActive: false,
      wasSuccessModalShown: false,
      hasEverHadSuccessfulRun: false,
      foldedLines: [],
      language: "jikiscript",

      // Editor store state
      defaultCode: initialCode,
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

        // Clean up old test's animation timeline callbacks
        if (oldTest?.animationTimeline) {
          oldTest.animationTimeline.clearUpdateCallbacks();
          oldTest.animationTimeline.clearCompleteCallbacks();
        }

        if (!test) {
          set({
            currentTest: test,
            currentTestTime: 0,
            currentFrame: undefined,
            highlightedLine: 0
          });
          return;
        }

        // Check if we have a saved time for this test
        const savedTime = state.testCurrentTimes[test.slug];
        const timeToUse = savedTime !== undefined ? savedTime : (test.frames.at(0)?.time ?? 0);

        set({
          currentTest: test,
          currentFrame: undefined,
          highlightedLine: 0
        });

        // Set up animation timeline callback to sync with store
        test.animationTimeline.onUpdate((anim) => {
          // Convert from milliseconds to microseconds
          get().setCurrentTestTime(anim.currentTime * TIME_SCALE_FACTOR);
        });

        // Set up completion callback to update play/pause state and show success modal
        test.animationTimeline.onComplete(() => {
          const state = get();
          state.setIsPlaying(false);

          // Check if all tests passed and we haven't shown the modal yet
          const allTestsPassed = state.testSuiteResult?.tests.every((t) => t.status === "pass") ?? false;
          if (allTestsPassed && !state.wasSuccessModalShown) {
            showModal("exercise-success-modal");
            state.setWasSuccessModalShown(true);
            state.setIsSpotlightActive(false);
          }
        });

        // Trigger frame calculations with the restored/initial time
        get().setCurrentTestTime(timeToUse, "nearest", true);

        if (state.shouldPlayOnTestChange) {
          get().setIsPlaying(true);
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

        set({
          currentFrame: frame,
          highlightedLine: frame.line,
          // Update information widget data whenever frame changes
          informationWidgetData: {
            html: frame.generateDescription() || "",
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
      setWasSuccessModalShown: (value) => set({ wasSuccessModalShown: value }),
      setHasEverHadSuccessfulRun: (value) => set({ hasEverHadSuccessfulRun: value }),
      setFoldedLines: (lines) => {
        set({ foldedLines: lines });

        // Recalculate frames that are affected by folded lines
        get().recalculateNavigationFrames();
        get().recalculateBreakpointFrames();
      },

      // Editor store actions
      setDefaultCode: (code) => set({ defaultCode: code }),
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
        // Check if all tests passed
        const allTestsPassed = result ? result.tests.every((test) => test.status === "pass") : false;
        const state = get();

        // Only enable spotlight if all tests passed AND this is the first time we've had a successful run
        const shouldActivateSpotlight = allTestsPassed && !state.hasEverHadSuccessfulRun;

        // Set the test suite result and reset things.
        set({
          testSuiteResult: result,
          shouldPlayOnTestChange: true,
          hasCodeBeenEdited: false,
          status: "success",
          testCurrentTimes: {},
          // wasSuccessModalShown is NOT reset - it's a one-way flag (false -> true)
          // Enable spotlight only on first successful run
          isSpotlightActive: shouldActivateSpotlight,
          // Mark that we've had a successful run if all tests passed
          hasEverHadSuccessfulRun: state.hasEverHadSuccessfulRun || allTestsPassed,
          // Reset playing state to allow animations to play on new test suite
          isPlaying: false
        });

        // Also set the first test as current by default
        if (result && result.tests.length > 0) {
          // Call setCurrentTest which will handle all the logic including setting time
          // and auto-playing the test.
          get().setCurrentTest(result.tests[0]);
        }
      },
      setShouldPlayOnTestChange: (shouldAutoPlay) => set({ shouldPlayOnTestChange: shouldAutoPlay }),
      setIsPlaying: (playing) => {
        const state = get();

        // Early return if state hasn't changed
        if (state.isPlaying === playing) {
          return;
        }

        set({ isPlaying: playing });

        if (!state.currentTest) {
          return;
        }

        if (playing) {
          // Hide information widget when playing
          state.setShouldShowInformationWidget(false);
          // Start the animation timeline
          state.currentTest.animationTimeline.play();
        } else {
          // Pause the animation timeline
          state.currentTest.animationTimeline.pause();
        }
      },

      // Exercise data initialization with priority logic
      initializeExerciseData: (serverData?: {
        code: string;
        storedAt?: string;
        readonlyRanges?: { from: number; to: number }[];
      }) => {
        const localStorageResult = loadCodeMirrorContent(exerciseUuid);

        // Rule 1: No server data and no localStorage - use initial code
        if (!serverData && (!localStorageResult.success || !localStorageResult.data)) {
          set({
            code: initialCode,
            defaultCode: initialCode
          });
          return;
        }

        // Rule 2: No server data but localStorage exists - use localStorage
        if (!serverData && localStorageResult.success && localStorageResult.data) {
          set({
            code: localStorageResult.data.code,
            defaultCode: localStorageResult.data.code
          });
          return;
        }

        // Rule 3: Server data exists, check against localStorage
        if (serverData) {
          // No localStorage - use server data
          if (!localStorageResult.success || !localStorageResult.data) {
            set({
              code: serverData.code,
              defaultCode: serverData.code
            });
            return;
          }

          // Both exist - compare timestamps
          const localStorageData = localStorageResult.data;

          // If server has no timestamp, use localStorage
          if (!serverData.storedAt) {
            set({
              code: localStorageData.code,
              defaultCode: localStorageData.code
            });
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
            set({
              code: localStorageData.code,
              defaultCode: localStorageData.code
            });
            return;
          }

          // If only server timestamp is invalid, use localStorage
          if (!serverTimeValid && localTimeValid) {
            set({
              code: localStorageData.code,
              defaultCode: localStorageData.code
            });
            return;
          }

          // If only localStorage timestamp is invalid, use server
          if (serverTimeValid && !localTimeValid) {
            set({
              code: serverData.code,
              defaultCode: serverData.code
            });
            return;
          }

          // Both timestamps are valid - compare them
          if (serverTime > localTime + ONE_MINUTE) {
            // Server is newer - use server data
            set({
              code: serverData.code,
              defaultCode: serverData.code
            });
          } else {
            // localStorage is newer or equal - use localStorage
            set({
              code: localStorageData.code,
              defaultCode: localStorageData.code
            });
          }
        }
      },

      // Task management actions
      setTaskProgress: (taskProgress) => set({ taskProgress }),
      setCompletedTasks: (completedTasks) => set({ completedTasks }),
      setCurrentTaskId: (currentTaskId) => set({ currentTaskId }),

      reset: () =>
        set({
          code: "",
          exerciseTitle: "Greeting Function Exercise",
          output: "",
          status: "idle",
          error: null,
          currentTest: null,
          hasCodeBeenEdited: false,
          isSpotlightActive: false,
          wasSuccessModalShown: false,
          hasEverHadSuccessfulRun: false,
          foldedLines: [],
          language: "jikiscript",

          // Reset editor store state
          defaultCode: "",
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

          // Reset task management state
          taskProgress: new Map(),
          completedTasks: new Set(),
          currentTaskId: null
        })
    }))
  );
}

// Hook to use with an orchestrator instance
export function useOrchestratorStore(orchestrator: { getStore: () => StoreApi<OrchestratorStore> }): OrchestratorState {
  return useStore(
    orchestrator.getStore(),
    useShallow((state) => ({
      exerciseUuid: state.exerciseUuid,
      exerciseTitle: state.exerciseTitle,
      code: state.code,
      output: state.output,
      status: state.status,
      error: state.error,
      currentTest: state.currentTest,
      hasCodeBeenEdited: state.hasCodeBeenEdited,
      isSpotlightActive: state.isSpotlightActive,
      wasSuccessModalShown: state.wasSuccessModalShown,
      hasEverHadSuccessfulRun: state.hasEverHadSuccessfulRun,
      foldedLines: state.foldedLines,
      language: state.language,

      // Editor store state
      defaultCode: state.defaultCode,
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

      // Task management state
      taskProgress: state.taskProgress,
      completedTasks: state.completedTasks,
      currentTaskId: state.currentTaskId
    }))
  );
}
