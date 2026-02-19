import type { Task, VisualScenario } from "../types";
import type ProcessGameExercise from "./Exercise";

export const tasks = [
  {
    id: "process-game" as const,
    name: "Process a full game",
    description:
      "Create a function called processGame that takes a target word and a list of guesses, and calls colorRow for each guess with the correct states.",
    hints: [
      "Iterate through the guesses using a loop with an index",
      "Reuse your processGuess logic for each guess",
      "Call colorRow(idx, states) for each row"
    ],
    requiredScenarios: ["hole-in-one", "two-guesses", "three-guesses", "phew"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "hole-in-one",
    name: "First time!",
    description: "Deal with a first correct guess.",
    taskId: "process-game",
    functionCall: { name: "process_game", args: ["hello", ["hello"]] },

    expectations(exercise) {
      const ex = exercise as ProcessGameExercise;
      return [
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) ===
            JSON.stringify(["correct", "correct", "correct", "correct", "correct"]),
          errorHtml: "We expected all the letters to be green"
        }
      ];
    }
  },
  {
    slug: "two-guesses",
    name: "Nailed it in two",
    description: "Deal with two guesses.",
    taskId: "process-game",
    functionCall: { name: "process_game", args: ["hello", ["hallo", "hello"]] },

    expectations(exercise) {
      const ex = exercise as ProcessGameExercise;
      return [
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) ===
            JSON.stringify(["correct", "absent", "correct", "correct", "correct"]),
          errorHtml: "We expected the second letter to be absent"
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(1)) ===
            JSON.stringify(["correct", "correct", "correct", "correct", "correct"]),
          errorHtml: "We expected all the letters to be green"
        }
      ];
    }
  },
  {
    slug: "three-guesses",
    name: "Got there in three",
    description: "Deal with three guesses.",
    taskId: "process-game",
    functionCall: { name: "process_game", args: ["hello", ["hulal", "hallo", "hello"]] },

    expectations(exercise) {
      const ex = exercise as ProcessGameExercise;
      return [
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) ===
            JSON.stringify(["correct", "absent", "correct", "absent", "present"]),
          errorHtml: "We expected the second and fourth letters to be absent"
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(1)) ===
            JSON.stringify(["correct", "absent", "correct", "correct", "correct"]),
          errorHtml: "We expected the second letter to be absent"
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(2)) ===
            JSON.stringify(["correct", "correct", "correct", "correct", "correct"]),
          errorHtml: "We expected all the letters to be green"
        }
      ];
    }
  },
  {
    slug: "phew",
    name: "Phew!",
    description: "Phew! That was close!",
    taskId: "process-game",
    functionCall: {
      name: "process_game",
      args: ["block", ["jumpy", "trend", "jumbo", "crisp", "gowfy", "block"]]
    },

    expectations(exercise) {
      const ex = exercise as ProcessGameExercise;
      return [
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) === JSON.stringify(["absent", "absent", "absent", "absent", "absent"]),
          errorHtml: "We expected everything to be absent."
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(1)) === JSON.stringify(["absent", "absent", "absent", "absent", "absent"]),
          errorHtml: "We expected everything to be absent."
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(2)) === JSON.stringify(["absent", "absent", "absent", "present", "present"]),
          errorHtml: "We expected the last two to be present and the rest absent."
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(3)) === JSON.stringify(["present", "absent", "absent", "absent", "absent"]),
          errorHtml: "We expected the first to be present and the rest absent."
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(4)) === JSON.stringify(["absent", "present", "absent", "absent", "absent"]),
          errorHtml: "We expected the second to be present and the rest absent"
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(5)) ===
            JSON.stringify(["correct", "correct", "correct", "correct", "correct"]),
          errorHtml: "We expected all the letters to be green"
        }
      ];
    }
  }
];
