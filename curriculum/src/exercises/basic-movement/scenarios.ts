import type { Task, VisualScenario } from "../types";
import type BasicMovementExercise from "./Exercise";

export const tasks = [
  {
    id: "move-character" as const,
    name: "Move the character",
    description: "Learn basic movement by calling the move() function",
    hints: ["Call move() to advance the character", "Each move() call advances by 20 units"],
    requiredScenarios: ["start-at-0", "start-at-50"],
    bonus: false
  },
  {
    id: "bonus-challenges" as const,
    name: "Bonus challenges",
    description: "Try more advanced movement challenges",
    hints: ["You'll need to call move() more times", "Practice makes perfect!"],
    requiredScenarios: ["bonus-double-movement"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "start-at-0",
    name: "Starting from position 0",
    description: "Move the character 5 times starting from position 0",
    taskId: "move-character",

    setup(exercise) {
      (exercise as BasicMovementExercise).setStartPosition(0);
    },

    expectations(exercise) {
      const ex = exercise as BasicMovementExercise;
      return [
        {
          type: "visual" as const,
          pass: ex.position === 100,
          actual: ex.position,
          expected: 100,
          errorHtml: `Expected position to be 100 but got ${ex.position}. Did you call move() 5 times?`
        }
      ];
    }
  },

  {
    slug: "start-at-50",
    name: "Starting from position 50",
    description: "Move the character 5 times starting from position 50",
    taskId: "move-character",

    setup(exercise) {
      (exercise as BasicMovementExercise).setStartPosition(50);
    },

    expectations(exercise) {
      const ex = exercise as BasicMovementExercise;
      return [
        {
          type: "visual" as const,
          pass: ex.position === 150,
          actual: ex.position,
          expected: 150,
          errorHtml: `Expected position to be 150 but got ${ex.position}. Did you call move() 5 times?`
        }
      ];
    }
  },

  {
    slug: "bonus-double-movement",
    name: "Double movement",
    description: "Move the character 10 times",
    taskId: "bonus-challenges",

    setup(exercise) {
      (exercise as BasicMovementExercise).setStartPosition(0);
    },

    expectations(exercise) {
      const ex = exercise as BasicMovementExercise;
      return [
        {
          type: "visual" as const,
          pass: ex.position === 200,
          actual: ex.position,
          expected: 200,
          errorHtml: `Expected position to be 200 but got ${ex.position}. Did you call move() 10 times?`
        }
      ];
    }
  }
];
