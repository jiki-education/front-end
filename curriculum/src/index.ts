// Main exports from the curriculum package

// Export the exercise registry and type
export { exercises, type ExerciseSlug } from "./exercises";

// Export all types needed by consumers
export type {
  ExerciseDefinition,
  FunctionDoc,
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
export { Exercise, IOExercise, VisualExercise, type Animation } from "./Exercise";

// Export mock implementations for testing
export { TestExercise } from "./mocks";

// Export levels - language feature definitions for each level
export { getLanguageFeatures, getLevel, levels, type Level, type LevelId } from "./levels";

// Export test runner for curriculum validation
export {
  runAllIOScenarios,
  runAllVisualScenarios,
  runExerciseTests,
  runIOScenarioTest,
  runVisualScenarioTest,
  type ScenarioTestResult
} from "./test-runner";
