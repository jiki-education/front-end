import type { Task, VisualScenario } from "../types";
import type ProcessGameExercise from "./Exercise";

export const tasks = [
  {
    id: "process-game" as const,
    name: "tasks.processGame.name",
    description: "tasks.processGame.description",
    hints: [],
    requiredScenarios: ["hole-in-one", "two-guesses", "three-guesses", "phew"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "hole-in-one",
    name: "scenarios.holeInOne.name",
    description: "scenarios.holeInOne.description",
    taskId: "process-game",
    functionCall: { name: "process_game", args: ["hello", ["hello"]] },
    setup(exercise) {
      (exercise as ProcessGameExercise).drawGuesses(["hello"]);
    },
    expectations(exercise) {
      const ex = exercise as ProcessGameExercise;
      return [
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
    slug: "two-guesses",
    name: "scenarios.twoGuesses.name",
    description: "scenarios.twoGuesses.description",
    taskId: "process-game",
    functionCall: { name: "process_game", args: ["hello", ["hallo", "hello"]] },
    setup(exercise) {
      (exercise as ProcessGameExercise).drawGuesses(["hallo", "hello"]);
    },
    expectations(exercise) {
      const ex = exercise as ProcessGameExercise;
      return [
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) ===
            JSON.stringify(["correct", "absent", "correct", "correct", "correct"]),
          errorHtml: exercise.t("checks.twoGuesses.firstRow")
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(1)) ===
            JSON.stringify(["correct", "correct", "correct", "correct", "correct"]),
          errorHtml: exercise.t("checks.twoGuesses.secondRow")
        }
      ];
    }
  },
  {
    slug: "three-guesses",
    name: "scenarios.threeGuesses.name",
    description: "scenarios.threeGuesses.description",
    taskId: "process-game",
    functionCall: { name: "process_game", args: ["hello", ["hulal", "hallo", "hello"]] },
    setup(exercise) {
      (exercise as ProcessGameExercise).drawGuesses(["hulal", "hallo", "hello"]);
    },
    expectations(exercise) {
      const ex = exercise as ProcessGameExercise;
      return [
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) ===
            JSON.stringify(["correct", "absent", "correct", "absent", "present"]),
          errorHtml: exercise.t("checks.threeGuesses.firstRow")
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(1)) ===
            JSON.stringify(["correct", "absent", "correct", "correct", "correct"]),
          errorHtml: exercise.t("checks.threeGuesses.secondRow")
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(2)) ===
            JSON.stringify(["correct", "correct", "correct", "correct", "correct"]),
          errorHtml: exercise.t("checks.threeGuesses.thirdRow")
        }
      ];
    }
  },
  {
    slug: "phew",
    name: "scenarios.phew.name",
    description: "scenarios.phew.description",
    taskId: "process-game",
    functionCall: {
      name: "process_game",
      args: ["block", ["jumpy", "trend", "jumbo", "crisp", "gowfy", "block"]]
    },
    setup(exercise) {
      (exercise as ProcessGameExercise).drawGuesses(["jumpy", "trend", "jumbo", "crisp", "gowfy", "block"]);
    },
    expectations(exercise) {
      const ex = exercise as ProcessGameExercise;
      return [
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) === JSON.stringify(["absent", "absent", "absent", "absent", "absent"]),
          errorHtml: exercise.t("checks.phew.firstRow")
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(1)) === JSON.stringify(["absent", "absent", "absent", "absent", "absent"]),
          errorHtml: exercise.t("checks.phew.secondRow")
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(2)) === JSON.stringify(["absent", "absent", "absent", "present", "present"]),
          errorHtml: exercise.t("checks.phew.thirdRow")
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(3)) === JSON.stringify(["present", "absent", "absent", "absent", "absent"]),
          errorHtml: exercise.t("checks.phew.fourthRow")
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(4)) === JSON.stringify(["absent", "present", "absent", "absent", "absent"]),
          errorHtml: exercise.t("checks.phew.fifthRow")
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(5)) ===
            JSON.stringify(["correct", "correct", "correct", "correct", "correct"]),
          errorHtml: exercise.t("checks.phew.sixthRow")
        }
      ];
    }
  }
];
