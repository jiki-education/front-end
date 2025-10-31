// Main exports from the curriculum package

// Export the exercise registry and type
export { exercises, type ExerciseSlug } from "./exercises";

// Export all types needed by consumers
export type {
  ExerciseDefinition,
  VisualExerciseDefinition,
  IOExerciseDefinition,
  Task,
  Scenario,
  IOScenario,
  TestExpect,
  FunctionDoc,
  TaskProgress
} from "./exercises/types";

// Export the base Exercise classes and Animation type
export { VisualExercise, IOExercise, Exercise, type Animation } from "./Exercise";

// Export mock implementations for testing
export { TestExercise } from "./mocks";

// Export levels - language feature definitions for each level
export { levels, getLevel, getLanguageFeatures, type Level, type LevelId } from "./levels";

// Export test runner for curriculum validation
export {
  runVisualScenarioTest,
  runIOScenarioTest,
  runAllVisualScenarios,
  runAllIOScenarios,
  runExerciseTests,
  // Backwards compatibility (deprecated)
  runScenarioTest,
  runAllScenarios,
  type ScenarioTestResult
} from "./test-runner";
