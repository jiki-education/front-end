import type { ExerciseDefinition } from "@jiki/curriculum";
import { TestExercise } from "@jiki/curriculum";
import { tasks, scenarios } from "./scenarios";

export const testExerciseDefinition: ExerciseDefinition = {
  type: "visual",
  slug: "test-exercise",
  title: "Test Exercise",
  instructions: "This is a test exercise for unit tests",
  estimatedMinutes: 5,
  levelId: "level-1",
  stubs: {
    javascript: "// Test code",
    python: "# Test code",
    jikiscript: "// Test code"
  },
  solutions: {
    javascript: "// Solution code",
    python: "# Solution code",
    jikiscript: "// Solution code"
  },
  ExerciseClass: TestExercise,
  tasks,
  scenarios,
  hints: ["Test hint 1", "Test hint 2"]
};

export default testExerciseDefinition;
