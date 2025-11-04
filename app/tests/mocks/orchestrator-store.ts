import { TimelineManager } from "@/components/coding-exercise/lib/orchestrator/TimelineManager";
import type { OrchestratorStore } from "@/components/coding-exercise/lib/types";
import { subscribeWithSelector } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

// Helper to create mock store with overrides
export function createMockOrchestratorStore(overrides: Partial<OrchestratorStore> = {}) {
  const store = createStore(
    subscribeWithSelector<OrchestratorStore>((set, _get) => ({
      // Default state
      exerciseSlug: "test-uuid",
      exerciseTitle: "Test Exercise",
      code: "",
      output: "",
      status: "idle" as const,
      error: null,
      currentTest: null,
      hasCodeBeenEdited: false,
      isSpotlightActive: false,
      wasSuccessModalShown: false,
      hasEverHadSuccessfulRun: false,
      foldedLines: [],
      language: "jikiscript" as const,

      // Editor store state
      defaultCode: "",
      readonly: false,
      shouldShowInformationWidget: false,
      underlineRange: undefined,
      highlightedLineColor: "yellow",
      highlightedLine: 0,
      informationWidgetData: { html: "", line: 0, status: "SUCCESS" },
      breakpoints: [],
      shouldAutoRunCode: false,

      // Error store state
      hasUnhandledError: false,
      unhandledErrorBase64: "",
      hasSyntaxError: false,

      // Editor handler state
      latestValueSnapshot: undefined,

      // Test results state
      testSuiteResult: null,
      shouldPlayOnTestChange: true,

      // Frame navigation state
      prevFrame: undefined,
      nextFrame: undefined,
      prevBreakpointFrame: undefined,
      nextBreakpointFrame: undefined,

      // Test time persistence
      testCurrentTimes: {},

      // Current test time
      currentTestTime: 0,

      // Current frame
      currentFrame: undefined,

      // Play/pause state
      isPlaying: false,

      // Task management state
      taskProgress: new Map(),
      completedTasks: new Set(),
      currentTaskId: null,

      // Apply overrides
      ...overrides,

      // Actions
      setCode: jest.fn(),
      setExerciseTitle: jest.fn(),
      setOutput: jest.fn(),
      setStatus: jest.fn(),
      setError: jest.fn(),
      setCurrentTest: jest.fn(),
      setCurrentFrame: jest.fn(),
      setCurrentTestTime: (time: number) =>
        set((state) => {
          if (!state.currentTest) {
            return {};
          }

          // Calculate the nearest frame
          const nearestFrame = TimelineManager.findNearestFrame(state.currentTest.frames, time, state.foldedLines);

          return {
            currentTestTime: time,
            currentFrame: nearestFrame || undefined
          };
        }),
      setHasCodeBeenEdited: jest.fn(),
      setIsSpotlightActive: jest.fn(),
      setWasSuccessModalShown: jest.fn(),
      setHasEverHadSuccessfulRun: jest.fn(),
      setFoldedLines: jest.fn(),
      setLanguage: jest.fn(),

      // Editor store actions
      setDefaultCode: jest.fn(),
      setReadonly: jest.fn(),
      setShouldShowInformationWidget: jest.fn(),
      setUnderlineRange: jest.fn(),
      setHighlightedLineColor: jest.fn(),
      setHighlightedLine: jest.fn(),
      setInformationWidgetData: jest.fn(),
      setBreakpoints: jest.fn(),
      setShouldAutoRunCode: jest.fn(),

      // Error store actions
      setHasUnhandledError: jest.fn(),
      setUnhandledErrorBase64: jest.fn(),
      setHasSyntaxError: jest.fn(),

      // Editor handler actions
      setLatestValueSnapshot: jest.fn(),

      // Test results actions
      setTestSuiteResult: jest.fn(),
      setShouldPlayOnTestChange: jest.fn(),

      // Play/pause action
      setIsPlaying: jest.fn(),

      // Exercise data initialization
      initializeExerciseData: jest.fn(),

      // Task management actions
      setTaskProgress: jest.fn(),
      setCompletedTasks: jest.fn(),
      setCurrentTaskId: jest.fn(),

      reset: jest.fn(),

      // Private actions
      recalculateNavigationFrames: jest.fn(),
      recalculateBreakpointFrames: jest.fn()
    }))
  );

  // Mock the setState method which is used for atomic updates
  store.setState = jest.fn();

  return store;
}
