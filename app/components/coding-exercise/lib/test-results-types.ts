import type { Frame } from "@jiki/interpreters";
import type { AnimationTimeline } from "./AnimationTimeline";

// Import expect types from curriculum (single source of truth)
import type { IOTestExpect, VisualTestExpect } from "@jiki/curriculum";
export type { CodeCheckExpect, IOTestExpect, TestExpect, VisualTestExpect } from "@jiki/curriculum";

export interface TestFrame {
  description: string;
  line: number;
  status: "SUCCESS" | "ERROR";
}

// Base interface for common test properties
interface BaseTestResult {
  slug: string;
  name: string;
  status: "pass" | "fail" | "idle";
  codeRun?: string;
  imageSlug?: string;
  frames: Frame[]; // Execution frames for scrubber timeline
  logLines: Array<{ time: number; output: string }>; // Console output with timestamps
}

// Visual test result - includes view and animation timeline
export interface VisualTestResult extends BaseTestResult {
  type: "visual";
  expects: VisualTestExpect[];
  view: HTMLElement;
  animationTimeline: AnimationTimeline; // Required for auto-play
}

// IO test result - function call with expected/actual comparison
export interface IOTestResult extends BaseTestResult {
  type: "io";
  expects: IOTestExpect[];
  functionName: string;
  args: any[];
  animationTimeline?: never; // IO tests don't have animation timeline
}

// Discriminated union of test result types
export type TestResult = VisualTestResult | IOTestResult;

// Type guard helpers
export function isVisualTest(test: TestResult): test is VisualTestResult {
  return test.type === "visual";
}

export function isIOTest(test: TestResult): test is IOTestResult {
  return test.type === "io";
}

export interface TestSuiteResult {
  tests: TestResult[];
  passed: boolean;
}

export interface TestResultsState {
  testSuiteResult: TestSuiteResult | null;
  shouldAutoplayAnimation: boolean;
}
