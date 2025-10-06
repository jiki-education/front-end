import type { ExerciseDefinition } from "@jiki/curriculum";
import { TestExercise } from "@jiki/curriculum";
import { tasks, scenarios } from "./scenarios";

export const testExerciseDefinition: ExerciseDefinition = {
  slug: "test-exercise",
  title: "Test Exercise",
  instructions: "This is a test exercise for unit tests",
  estimatedMinutes: 5,
  levelId: "level-1",
  initialCode: "// Test code",
  ExerciseClass: TestExercise,
  tasks,
  scenarios,
  hints: ["Test hint 1", "Test hint 2"],
  solutions: {
    jikiscript: "move()\nmove()\nmove()\nmove()\nmove()"
  }
};

export default testExerciseDefinition;
