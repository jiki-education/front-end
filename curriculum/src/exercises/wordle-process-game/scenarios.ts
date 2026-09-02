import { expectRowStates } from "../../exercise-categories/wordle/expectRowStates";
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
  },
  {
    id: "duplicate-letters" as const,
    name: "tasks.duplicateLetters.name",
    description: "tasks.duplicateLetters.description",
    hints: [],
    requiredScenarios: ["bonus-1", "bonus-2"],
    bonus: true
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
      return [expectRowStates(ex, 0, ["correct", "correct", "correct", "correct", "correct"])];
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
        expectRowStates(ex, 0, ["correct", "absent", "correct", "correct", "correct"]),
        expectRowStates(ex, 1, ["correct", "correct", "correct", "correct", "correct"])
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
        expectRowStates(ex, 0, ["correct", "absent", "correct", "absent", "present"]),
        expectRowStates(ex, 1, ["correct", "absent", "correct", "correct", "correct"]),
        expectRowStates(ex, 2, ["correct", "correct", "correct", "correct", "correct"])
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
        expectRowStates(ex, 0, ["absent", "absent", "absent", "absent", "absent"]),
        expectRowStates(ex, 1, ["absent", "absent", "absent", "absent", "absent"]),
        expectRowStates(ex, 2, ["absent", "absent", "absent", "present", "present"]),
        expectRowStates(ex, 3, ["present", "absent", "absent", "absent", "absent"]),
        expectRowStates(ex, 4, ["absent", "present", "absent", "absent", "absent"]),
        expectRowStates(ex, 5, ["correct", "correct", "correct", "correct", "correct"])
      ];
    }
  },
  {
    slug: "bonus-1",
    name: "scenarios.bonus1.name",
    description: "scenarios.bonus1.description",
    taskId: "duplicate-letters",
    functionCall: { name: "process_game", args: ["clamp", ["which", "colly", "class", "clamp"]] },
    setup(exercise) {
      (exercise as ProcessGameExercise).drawGuesses(["which", "colly", "class", "clamp"]);
    },
    expectations(exercise) {
      const ex = exercise as ProcessGameExercise;
      return [
        expectRowStates(ex, 0, ["absent", "absent", "absent", "present", "absent"]),
        expectRowStates(ex, 1, ["correct", "absent", "present", "absent", "absent"]),
        expectRowStates(ex, 2, ["correct", "correct", "correct", "absent", "absent"]),
        expectRowStates(ex, 3, ["correct", "correct", "correct", "correct", "correct"])
      ];
    }
  },
  {
    slug: "bonus-2",
    name: "scenarios.bonus2.name",
    description: "scenarios.bonus2.description",
    taskId: "duplicate-letters",
    functionCall: {
      name: "process_game",
      args: ["swims", ["which", "swift", "swine", "swiss", "swigs", "swims"]]
    },
    setup(exercise) {
      (exercise as ProcessGameExercise).drawGuesses(["which", "swift", "swine", "swiss", "swigs", "swims"]);
    },
    expectations(exercise) {
      const ex = exercise as ProcessGameExercise;
      return [
        expectRowStates(ex, 0, ["present", "absent", "correct", "absent", "absent"]),
        expectRowStates(ex, 1, ["correct", "correct", "correct", "absent", "absent"]),
        expectRowStates(ex, 2, ["correct", "correct", "correct", "absent", "absent"]),
        expectRowStates(ex, 3, ["correct", "correct", "correct", "absent", "correct"]),
        expectRowStates(ex, 4, ["correct", "correct", "correct", "absent", "correct"]),
        expectRowStates(ex, 5, ["correct", "correct", "correct", "correct", "correct"])
      ];
    }
  }
];
