import type { Frame } from "@jiki/interpreters";
import type { AnimationTimeline } from "./AnimationTimeline";

export interface TestExpect {
  pass: boolean;
  actual: any;
  expected?: any;
  errorHtml?: string;
  codeRun?: string;
}

export interface TestFrame {
  description: string;
  line: number;
  status: "SUCCESS" | "ERROR";
}

// Unified TestResult type that includes both test data and navigation state
export interface TestResult {
  // Core test properties
  slug: string;
  name: string;
  status: "pass" | "fail" | "idle";
  expects: TestExpect[];
  frames: Frame[]; // Execution frames for scrubber timeline
  codeRun?: string;
  imageSlug?: string;

  // Required display and timeline properties
  view: HTMLElement;
  animationTimeline: AnimationTimeline; // Always required for scrubber navigation
}

export interface TestSuiteResult {
  tests: TestResult[];
  status: "pass" | "fail" | "running" | "idle";
}

export interface TestResultsState {
  testSuiteResult: TestSuiteResult | null;
  shouldAutoplayAnimation: boolean;
}
