/**
 * Test factories for creating mock objects used in tests.
 * These provide consistent, typed mocks with sensible defaults.
 */

export { createMockAnimationTimeline, mockAnimationTimelineWithDuration } from "./animation-timeline";
export { createMockExercise } from "./exercise";
export { createMockFrame } from "./frame";
export { createMockOrchestrator } from "./orchestrator";
export { createMockOrchestratorStore } from "./orchestrator-store";
export { createMockScenario } from "./scenario";
export { createMockTask } from "./task";
export { createMockTestResult } from "./test-result";
export { createMockTestSuiteResult } from "./test-suite-result";
export { createMockUser } from "./user";

// UI Kit mocks
export {
  MockIcon,
  MockEmailIcon,
  MockEmailIconFocused,
  MockGoogleIcon,
  MockProjectsIcon,
  createMockTabItems,
  createMockFormFieldProps,
  createMockPageHeaderProps,
  createMockHandlers,
  waitForAnimation
} from "./ui-kit";
