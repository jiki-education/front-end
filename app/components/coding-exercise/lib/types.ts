import type { Frame } from "@jiki/interpreters";
import type { TestResult, TestSuiteResult } from "./test-results-types";

// CodeMirror editor types
export interface UnderlineRange {
  from: number;
  to: number;
}

export interface InformationWidgetData {
  html: string;
  line: number;
  status: "SUCCESS" | "ERROR";
}

// Public read-only state that components can access
export interface OrchestratorState {
  exerciseUuid: string;
  exerciseTitle: string; // Exercise title for UI display
  code: string;
  output: string;
  status: "idle" | "running" | "success" | "error";
  error: string | null;
  currentTest: TestResult | null;
  hasCodeBeenEdited: boolean;
  isSpotlightActive: boolean;
  wasSuccessModalShown: boolean;
  allTestsPassed: boolean;
  foldedLines: number[]; // Line numbers that are currently folded in the editor
  language: "javascript" | "python" | "jikiscript";

  // Editor store state
  defaultCode: string;
  readonly: boolean;
  shouldShowInformationWidget: boolean;
  underlineRange: UnderlineRange | undefined;
  highlightedLineColor: string;
  highlightedLine: number;
  informationWidgetData: InformationWidgetData;
  breakpoints: number[];
  shouldAutoRunCode: boolean;

  // Error store state
  hasUnhandledError: boolean;
  unhandledErrorBase64: string;
  hasSyntaxError: boolean;

  // Editor handler state
  latestValueSnapshot: string | undefined;

  // Test results state
  testSuiteResult: TestSuiteResult | null;
  shouldPlayOnTestChange: boolean;

  // Frame navigation state (moved from currentTest to top level)
  prevFrame?: Frame;
  nextFrame?: Frame;
  prevBreakpointFrame?: Frame;
  nextBreakpointFrame?: Frame;

  // Test time persistence - maps test slugs to their current time positions
  testCurrentTimes: Record<string, number | undefined>;

  // Current test time - extracted from currentTest to prevent rerenders
  currentTestTime: number;

  // Current frame - extracted from currentTest to prevent rerenders
  currentFrame: Frame | undefined;

  // Play/pause state for animation timeline
  isPlaying: boolean;
}

// Private actions only accessible within the orchestrator
export interface OrchestratorActions {
  setCode: (code: string) => void;
  setExerciseTitle: (title: string) => void;
  setOutput: (output: string) => void;
  setStatus: (status: OrchestratorState["status"]) => void;
  setError: (error: string | null) => void;
  setCurrentTest: (test: TestResult | null) => void;
  setCurrentFrame: (frame: Frame) => void;
  setCurrentTestTime: (time: number, nearestOrExactFrame?: "nearest" | "exact", force?: boolean) => void;
  setHasCodeBeenEdited: (value: boolean) => void;
  setIsSpotlightActive: (value: boolean) => void;
  setWasSuccessModalShown: (value: boolean) => void;
  setFoldedLines: (lines: number[]) => void;
  setLanguage: (language: OrchestratorState["language"]) => void;

  // Editor store actions
  setDefaultCode: (code: string) => void;
  setReadonly: (readonly: boolean) => void;
  setShouldShowInformationWidget: (show: boolean) => void;
  setUnderlineRange: (range: UnderlineRange | undefined) => void;
  setHighlightedLineColor: (color: string) => void;
  setHighlightedLine: (line: number) => void;
  setInformationWidgetData: (data: InformationWidgetData) => void;
  setBreakpoints: (breakpoints: number[]) => void;
  setShouldAutoRunCode: (shouldAutoRun: boolean) => void;

  // Error store actions
  setHasUnhandledError: (hasError: boolean) => void;
  setUnhandledErrorBase64: (errorData: string) => void;
  setHasSyntaxError: (hasError: boolean) => void;

  // Editor handler actions
  setLatestValueSnapshot: (value: string | undefined) => void;

  // Test results actions
  setTestSuiteResult: (result: TestSuiteResult | null) => void;

  // Play/pause action
  setIsPlaying: (playing: boolean) => void;
  setShouldPlayOnTestChange: (shouldPlayOnTestChange: boolean) => void;

  // Exercise data initialization
  initializeExerciseData: (serverData?: {
    code: string;
    storedAt?: string;
    readonlyRanges?: { from: number; to: number }[];
  }) => void;

  reset: () => void;
}

// Private actions that are not exposed to components
interface OrchestratorPrivateActions {
  recalculateNavigationFrames: () => void;
  recalculateBreakpointFrames: () => void;
}

// Combined store type
export type OrchestratorStore = OrchestratorState & OrchestratorActions & OrchestratorPrivateActions;
