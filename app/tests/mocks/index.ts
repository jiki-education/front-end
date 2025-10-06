/**
 * Test factories for creating mock objects used in tests.
 * These provide consistent, typed mocks with sensible defaults.
 */

export { mockAnimationTimeline, mockAnimationTimelineWithDuration } from "./mockAnimationTimeline";
export { mockFrame } from "./mockFrame";
export { mockOrchestrator } from "./orchestrator";
export { mockStore as createMockStore } from "./orchestrator-store";
export { mockTestResult } from "./test-result";
