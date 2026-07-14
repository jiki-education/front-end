import type { Frame, InterpretResult, LintError } from "@jiki/interpreters/shared";
import type { VisualExercise } from "@jiki/curriculum";
import type { AnimationTimeline } from "./AnimationTimeline";

// Import expect types from curriculum (single source of truth)
import type { IOTestExpect, VisualTestExpect } from "@jiki/curriculum";
export type { CodeCheckExpect, IOTestExpect, TestExpect, VisualTestExpect } from "@jiki/curriculum";

// Base interface for common test properties
interface BaseTestResult {
  slug: string;
  name: string;
  status: "pass" | "fail" | "idle" | "lint_warning";
  codeRun?: string;
  imageSlug?: string;
  frames: Frame[]; // Execution frames for scrubber timeline
  logLines: Array<{ time: number; output: string }>; // Console output with timestamps
  lintErrors: LintError[];
}

// Artifacts of a hidden isolated-check re-run, attached to the scenario's
// result for the progression evaluator. Not consumed by the store or the UI.
export interface IsolatedRunResult {
  checkSlug?: string; // the isolated check's slug, when it has one
  passed: boolean;
  exercise: VisualExercise;
  result: InterpretResult;
}

// Visual test result - includes view and animation timeline
export interface VisualTestResult extends BaseTestResult {
  type: "visual";
  expects: VisualTestExpect[];
  view: HTMLElement;
  animationTimeline: AnimationTimeline; // Required for auto-play
  exercise: VisualExercise; // the post-run exercise instance (halted state on runtime errors; progression evaluator only)
  result: InterpretResult; // the full interpreter result (progression evaluator only)
  isolatedRuns?: IsolatedRunResult[]; // isolated-check re-run artifacts (progression evaluator only)
}

// IO test result - function call with expected/actual comparison
export interface IOTestResult extends BaseTestResult {
  type: "io";
  expects: IOTestExpect[];
  functionName: string;
  args: any[];
  animationTimeline?: never; // IO tests don't have animation timeline
  // The full interpreter result (progression evaluator only). Optional for a
  // domain reason: when the interpreter THROWS (e.g. a scan error) instead of
  // returning an errored result, no InterpretResult exists for this run.
  result?: InterpretResult;
}

// Discriminated union of test result types
export type TestResult = VisualTestResult | IOTestResult;

export interface TestSuiteResult {
  tests: TestResult[];
  passed: boolean;
}
