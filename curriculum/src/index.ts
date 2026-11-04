// Main exports from the curriculum package

// Export the exercise registry, loader function, and type
export { exercises, getExercise, type RegisteredExerciseSlug } from "./exercises";

// Export the slug registries so consumers can classify a slug without the API
export {
  exerciseLessonSlugs,
  videoLessonSlugs,
  challengeSlugs,
  isExerciseLessonSlug,
  isChallengeSlug,
  isVideoLessonSlug,
  type ExerciseLessonSlug,
  type VideoLessonSlug,
  type ChallengeSlug,
  type LessonSlug,
  type ExerciseSlug
} from "./slugs";

// Export the scenario-runs factory used by progression evaluators
export { createScenarioRuns } from "./exercises/scenarioRuns";

// Export the progression stdlib (metrics shared across exercises)
export { locMetric } from "./exercises/progressionStdlib";

// Export core types
export type { Language } from "./types";

// Export all types needed by consumers
export type {
  CodeCheck,
  CodeCheckExpect,
  ExerciseCore,
  ExerciseDefinition,
  FunctionInfo,
  Hint,
  InterpreterOptions,
  IOExerciseCore,
  IOExerciseDefinition,
  IOExpectedValue,
  IOScenario,
  IOTestExpect,
  IOValue,
  IsolatedCheck,
  ProgressionMetric,
  ProgressionMetrics,
  ReadonlyRange,
  ScenarioRun,
  ScenarioRuns,
  VisualScenario,
  Scenario,
  Task,
  TaskProgress,
  TestExpect,
  VisualExerciseCore,
  VisualExerciseDefinition,
  VisualTestExpect
} from "./exercises/types";

// Export the translator factory so the app can resolve static display strings
// against the same fetched per-exercise message dict.
export { createTranslator, type Messages, type Translator } from "./i18n/translator";

// Export the base Exercise classes and Animation type
export { Exercise } from "./Exercise";
export { IOExercise } from "./IOExercise";
export { VisualExercise, type Animation } from "./VisualExercise";

// Export mock implementations for testing
export { TestExercise } from "./mocks";

// Export levels - language feature definitions for each level
export { getLanguageFeatures, getLevel, getTaughtConcepts, levels, type Level, type LevelId } from "./levels";

// Export LLM metadata types and accessor
// NOTE: This will NOT be bundled in app builds due to tree-shaking
// Only llm-chat-proxy should import this
export { getLLMMetadata, type LLMMetadata } from "./llm-metadata";
