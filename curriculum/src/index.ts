// Main exports from the curriculum package

// Export the exercise registry, loader function, and type
export { exercises, getExercise, type ExerciseSlug } from "./exercises";

// Export core types
export type { Language } from "./types";

// Export all types needed by consumers
export type {
  CodeCheck,
  CodeCheckExpect,
  ExerciseDefinition,
  FunctionInfo,
  IOExerciseDefinition,
  IOScenario,
  IOTestExpect,
  VisualScenario,
  Scenario,
  Task,
  TaskProgress,
  TestExpect,
  VisualExerciseDefinition,
  VisualTestExpect
} from "./exercises/types";

// Export the base Exercise classes and Animation type
export { Exercise } from "./Exercise";
export { IOExercise } from "./IOExercise";
export { VisualExercise, type Animation } from "./VisualExercise";

// Export mock implementations for testing
export { TestExercise } from "./mocks";

// Export levels - language feature definitions for each level
export { getLanguageFeatures, getLevel, levels, type Level, type LevelId } from "./levels";

// Export LLM metadata types and accessor
// NOTE: This will NOT be bundled in app builds due to tree-shaking
// Only llm-chat-proxy should import this
export { getLLMMetadata, type LLMMetadata } from "./llm-metadata";

// Export code check utilities
export { countLinesOfCode, getSourceCode } from "./utils/code-checks";
