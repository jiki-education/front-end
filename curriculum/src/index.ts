// Main exports from the curriculum package

// Export the exercise registry, loader function, and type
export { exercises, getExercise, type ExerciseSlug } from "./exercises";

// Export all types needed by consumers
export type { ExerciseDefinition, Task, Scenario, TestExpect, FunctionDoc, TaskProgress } from "./exercises/types";

// Export the base Exercise class and Animation type
export { Exercise, type Animation } from "./Exercise";

// Export mock implementations for testing
export { TestExercise } from "./mocks";

// Export levels - language feature definitions for each level
export { levels, getLevel, getLanguageFeatures, type Level, type LevelId } from "./levels";

// Export test runner for curriculum validation
export { runScenarioTest, runAllScenarios, runExerciseTests, type ScenarioTestResult } from "./test-runner";
