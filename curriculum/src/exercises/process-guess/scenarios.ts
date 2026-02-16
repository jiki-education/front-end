import type { Task, VisualScenario } from "../types";
import type ProcessGuessExercise from "./Exercise";

export const tasks = [
  {
    id: "process-guess" as const,
    name: "Process a single guess",
    description:
      "Create a function called process_first_guess that takes a target word and a guess, works out the state of each letter (correct, present, or absent), then calls color_row(1, states) with the results.",
    hints: [
      "Use a helper function to check if a letter is contained in the word",
      "Compare each letter at the same position for 'correct'",
      "Check if the letter exists anywhere in the word for 'present'",
      "Build up the states list using push()"
    ],
    requiredScenarios: ["all-correct", "absent", "present", "complex", "different-word"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "all-correct",
    name: "All correct",
    description: "Deal with a fully correct guess",
    taskId: "process-guess",
    functionCall: { name: "process_first_guess", args: ["hello", "hello"] },

    expectations(exercise) {
      const ex = exercise as ProcessGuessExercise;
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
    slug: "absent",
    name: "Some absent",
    description: "Handle when some letters are wrong",
    taskId: "process-guess",
    functionCall: { name: "process_first_guess", args: ["hello", "hallu"] },

    expectations(exercise) {
      const ex = exercise as ProcessGuessExercise;
      return [
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) ===
            JSON.stringify(["correct", "absent", "correct", "correct", "absent"]),
          errorHtml: "We expected the 'a' and 'u' to be absent"
        }
      ];
    }
  },
  {
    slug: "present",
    name: "Some present",
    description: "Deal with letters in the wrong place",
    taskId: "process-guess",
    functionCall: { name: "process_first_guess", args: ["hello", "hlelo"] },

    expectations(exercise) {
      const ex = exercise as ProcessGuessExercise;
      return [
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) ===
            JSON.stringify(["correct", "present", "present", "correct", "correct"]),
          errorHtml: "We expected the 'l' and 'e' to be present."
        }
      ];
    }
  },
  {
    slug: "complex",
    name: "Complex",
    description: "Deal with a more complex scenario",
    taskId: "process-guess",
    functionCall: { name: "process_first_guess", args: ["hello", "ehola"] },

    expectations(exercise) {
      const ex = exercise as ProcessGuessExercise;
      return [
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) ===
            JSON.stringify(["present", "present", "present", "correct", "absent"]),
          errorHtml: "We expected present, present, present, correct, absent"
        }
      ];
    }
  },
  {
    slug: "different-word",
    name: "A different word",
    description: "And finally a different word!",
    taskId: "process-guess",
    functionCall: { name: "process_first_guess", args: ["break", "beaks"] },

    expectations(exercise) {
      const ex = exercise as ProcessGuessExercise;
      return [
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) ===
            JSON.stringify(["correct", "present", "present", "present", "absent"]),
          errorHtml: "We expected correct, present, present, present, absent"
        }
      ];
    }
  }
];
