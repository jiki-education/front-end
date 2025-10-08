import type { ExerciseDefinition } from "@jiki/curriculum";
import { TestExercise } from "@jiki/curriculum";
import { scenarios, tasks } from "./mock-exercise/scenarios";

/**
 * Helper function to create a test exercise definition with custom overrides
 */
export function createMockExercise(overrides?: Partial<ExerciseDefinition>): ExerciseDefinition {
  return {
    slug: "test-exercise",
    title: "Test Exercise",
    instructions: "This is a test exercise",
    estimatedMinutes: 5,
    levelId: "level-1",
    initialCode: "// Test code",
    ExerciseClass: TestExercise,
    tasks,
    scenarios,
    ...overrides
  };
}
