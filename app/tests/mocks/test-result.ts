import type { TestResult } from "@/components/complex-exercise/lib/test-results-types";
import type { Frame } from "@jiki/interpreters";
import { mockAnimationTimeline } from "./index";

// Helper to create a mock TestResult
export function mockTestResult(
  frames: Frame[],
  slug: string = `test-${Math.random().toString(36).substr(2, 9)}`
): TestResult {
  // Calculate duration based on the last frame's time (convert from microseconds to milliseconds)
  const lastFrameTime = frames.length > 0 ? frames[frames.length - 1].time : 0;
  const duration = Math.max(5, Math.ceil(lastFrameTime / 1000)); // At least 5ms, or last frame time in ms

  return {
    slug,
    name: `Test ${slug}`,
    status: "pass" as const,
    expects: [],
    view: document.createElement("div"),
    frames,
    animationTimeline: mockAnimationTimeline({ duration })
  };
}
