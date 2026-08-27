import type { Task, VisualScenario, VisualTestExpect } from "../types";
import type WordleSolverExercise from "./Exercise";

export const tasks = [
  {
    id: "first-word" as const,
    name: "tasks.firstWord.name",
    description: "tasks.firstWord.description",
    hints: [],
    requiredScenarios: ["hole-in-one"],
    bonus: false
  },
  {
    id: "handle-wrong" as const,
    name: "tasks.handleWrong.name",
    description: "tasks.handleWrong.description",
    hints: [],
    requiredScenarios: ["entirely-wrong"],
    bonus: false
  },
  {
    id: "handle-partial" as const,
    name: "tasks.handlePartial.name",
    description: "tasks.handlePartial.description",
    hints: [],
    requiredScenarios: ["two-needed", "three-needed", "four-needed"],
    bonus: false
  },
  {
    id: "handle-present" as const,
    name: "tasks.handlePresent.name",
    description: "tasks.handlePresent.description",
    hints: [],
    requiredScenarios: ["present-1", "present-2", "present-3", "present-4"],
    bonus: false
  }
] as const satisfies readonly Task[];

function noRepeatedGuesses(exercise: WordleSolverExercise): VisualTestExpect {
  return {
    pass: !exercise.hasRepeatedGuess(),
    errorHtml: exercise.t("checks.repeatedGuess")
  };
}

export const scenarios: VisualScenario[] = [
  {
    slug: "hole-in-one",
    name: "scenarios.holeInOne.name",
    description: "scenarios.holeInOne.description",
    taskId: "first-word",
    functionCall: { name: "solve_wordle", args: [] },
    setup(exercise) {
      (exercise as WordleSolverExercise).setTargetWord("which");
    },
    expectations(exercise) {
      const ex = exercise as WordleSolverExercise;
      return [
        noRepeatedGuesses(ex),
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) ===
            JSON.stringify(["correct", "correct", "correct", "correct", "correct"]),
          errorHtml: exercise.t("checks.holeInOne.firstRow")
        }
      ];
    }
  },
  {
    slug: "entirely-wrong",
    name: "scenarios.entirelyWrong.name",
    description: "scenarios.entirelyWrong.description",
    taskId: "handle-wrong",
    functionCall: { name: "solve_wordle", args: [] },
    setup(exercise) {
      (exercise as WordleSolverExercise).setTargetWord("about");
    },
    expectations(exercise) {
      const ex = exercise as WordleSolverExercise;
      return [
        noRepeatedGuesses(ex),
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) === JSON.stringify(["absent", "absent", "absent", "absent", "absent"]),
          errorHtml: exercise.t("checks.entirelyWrong.firstRow")
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(1)) ===
            JSON.stringify(["correct", "correct", "correct", "correct", "correct"]),
          errorHtml: exercise.t("checks.entirelyWrong.secondRow")
        }
      ];
    }
  },
  {
    slug: "two-needed",
    name: "scenarios.twoNeeded.name",
    description: "scenarios.twoNeeded.description",
    taskId: "handle-partial",
    functionCall: { name: "solve_wordle", args: [] },
    setup(exercise) {
      (exercise as WordleSolverExercise).setTargetWord("would");
    },
    expectations(exercise) {
      const ex = exercise as WordleSolverExercise;
      return [
        noRepeatedGuesses(ex),
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) === JSON.stringify(["correct", "absent", "absent", "absent", "absent"]),
          errorHtml: exercise.t("checks.twoNeeded.firstRow")
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(1)) ===
            JSON.stringify(["correct", "correct", "correct", "correct", "correct"]),
          errorHtml: exercise.t("checks.twoNeeded.secondRow")
        }
      ];
    }
  },
  {
    slug: "three-needed",
    name: "scenarios.threeNeeded.name",
    description: "scenarios.threeNeeded.description",
    taskId: "handle-partial",
    functionCall: { name: "solve_wordle", args: [] },
    setup(exercise) {
      (exercise as WordleSolverExercise).setTargetWord("world");
    },
    expectations(exercise) {
      const ex = exercise as WordleSolverExercise;
      return [
        noRepeatedGuesses(ex),
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) === JSON.stringify(["correct", "absent", "absent", "absent", "absent"]),
          errorHtml: exercise.t("checks.threeNeeded.firstRow")
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(1)) ===
            JSON.stringify(["correct", "correct", "absent", "correct", "correct"]),
          errorHtml: exercise.t("checks.threeNeeded.secondRow")
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(2)) ===
            JSON.stringify(["correct", "correct", "correct", "correct", "correct"]),
          errorHtml: exercise.t("checks.threeNeeded.thirdRow")
        }
      ];
    }
  },
  {
    slug: "four-needed",
    name: "scenarios.fourNeeded.name",
    description: "scenarios.fourNeeded.description",
    taskId: "handle-partial",
    functionCall: { name: "solve_wordle", args: [] },
    setup(exercise) {
      (exercise as WordleSolverExercise).setTargetWord("women");
    },
    expectations(exercise) {
      const ex = exercise as WordleSolverExercise;
      return [
        noRepeatedGuesses(ex),
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) === JSON.stringify(["correct", "absent", "absent", "absent", "absent"]),
          errorHtml: exercise.t("checks.fourNeeded.firstRow")
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(1)) === JSON.stringify(["correct", "correct", "absent", "absent", "absent"]),
          errorHtml: exercise.t("checks.fourNeeded.secondRow")
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(2)) ===
            JSON.stringify(["correct", "correct", "correct", "absent", "correct"]),
          errorHtml: exercise.t("checks.fourNeeded.thirdRow")
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(3)) ===
            JSON.stringify(["correct", "correct", "correct", "correct", "correct"]),
          errorHtml: exercise.t("checks.fourNeeded.fourthRow")
        }
      ];
    }
  },
  {
    slug: "present-1",
    name: "scenarios.present1.name",
    description: "scenarios.present1.description",
    taskId: "handle-present",
    functionCall: { name: "solve_wordle", args: [] },
    setup(exercise) {
      (exercise as WordleSolverExercise).setTargetWord("twice");
    },
    expectations(exercise) {
      const ex = exercise as WordleSolverExercise;
      return [
        noRepeatedGuesses(ex),
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) ===
            JSON.stringify(["present", "absent", "correct", "correct", "absent"]),
          errorHtml: exercise.t("checks.present1.firstRow")
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(1)) ===
            JSON.stringify(["correct", "correct", "correct", "correct", "correct"]),
          errorHtml: exercise.t("checks.present1.secondRow")
        }
      ];
    }
  },
  {
    slug: "present-2",
    name: "scenarios.present2.name",
    description: "scenarios.present2.description",
    taskId: "handle-present",
    functionCall: { name: "solve_wordle", args: [] },
    setup(exercise) {
      (exercise as WordleSolverExercise).setTargetWord("power");
    },
    expectations(exercise) {
      const ex = exercise as WordleSolverExercise;
      return [
        noRepeatedGuesses(ex),
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) === JSON.stringify(["present", "absent", "absent", "absent", "absent"]),
          errorHtml: exercise.t("checks.present2.firstRow")
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(1)) ===
            JSON.stringify(["absent", "present", "absent", "present", "present"]),
          errorHtml: exercise.t("checks.present2.secondRow")
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(2)) ===
            JSON.stringify(["correct", "correct", "correct", "correct", "correct"]),
          errorHtml: exercise.t("checks.present2.thirdRow")
        }
      ];
    }
  },
  {
    slug: "present-3",
    name: "scenarios.present3.name",
    description: "scenarios.present3.description",
    taskId: "handle-present",
    functionCall: { name: "solve_wordle", args: [] },
    setup(exercise) {
      (exercise as WordleSolverExercise).setTargetWord("magic");
    },
    expectations(exercise) {
      const ex = exercise as WordleSolverExercise;
      return [
        noRepeatedGuesses(ex),
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) === JSON.stringify(["absent", "absent", "present", "present", "absent"]),
          errorHtml: exercise.t("checks.present3.firstRow")
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(1)) === JSON.stringify(["absent", "absent", "absent", "correct", "correct"]),
          errorHtml: exercise.t("checks.present3.secondRow")
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(2)) ===
            JSON.stringify(["correct", "absent", "absent", "correct", "correct"]),
          errorHtml: exercise.t("checks.present3.thirdRow")
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(3)) ===
            JSON.stringify(["correct", "correct", "correct", "correct", "correct"]),
          errorHtml: exercise.t("checks.present3.fourthRow")
        }
      ];
    }
  },
  {
    slug: "present-4",
    name: "scenarios.present4.name",
    description: "scenarios.present4.description",
    taskId: "handle-present",
    functionCall: { name: "solve_wordle", args: [] },
    setup(exercise) {
      (exercise as WordleSolverExercise).setTargetWord("sense");
    },
    expectations(exercise) {
      const ex = exercise as WordleSolverExercise;
      return [
        noRepeatedGuesses(ex),
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) === JSON.stringify(["absent", "absent", "absent", "absent", "absent"]),
          errorHtml: exercise.t("checks.present4.firstRow")
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(1)) === JSON.stringify(["absent", "absent", "absent", "absent", "absent"]),
          errorHtml: exercise.t("checks.present4.secondRow")
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(2)) === JSON.stringify(["present", "absent", "present", "absent", "absent"]),
          errorHtml: exercise.t("checks.present4.thirdRow")
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(3)) ===
            JSON.stringify(["correct", "correct", "correct", "present", "present"]),
          errorHtml: exercise.t("checks.present4.fourthRow")
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(4)) ===
            JSON.stringify(["correct", "correct", "correct", "correct", "correct"]),
          errorHtml: exercise.t("checks.present4.fifthRow")
        }
      ];
    }
  }
];
