import type { TestResult } from "@/components/coding-exercise/lib/test-results-types";
import { createMockAnimationTimeline } from "./index";

/**
 * Creates a mock TestResult with sensible defaults and optional overrides
 */
export function createMockTestResult(overrides: Partial<TestResult> = {}): TestResult {
  const frames = overrides.frames || [];
  const slug = overrides.slug || `test-${Math.random().toString(36).substr(2, 9)}`;

  // Calculate duration based on frames if provided
  const lastFrameTime = frames.length > 0 ? frames[frames.length - 1].time : 0;
  const duration = Math.max(5, Math.ceil(lastFrameTime / 1000));

  // Default animation timeline - use real one if frames exist, otherwise mock
  const defaultAnimationTimeline = frames.length > 0 ? createMockAnimationTimeline({ duration }) : ({} as any);

  return {
    type: "visual",
    slug,
    name: `Test ${slug}`,
    status: "pass",
    expects: [],
    view: document.createElement("div"),
    frames,
    logLines: [],
    animationTimeline: defaultAnimationTimeline,
    ...overrides
  } as TestResult;
}
