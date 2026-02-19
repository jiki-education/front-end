import type { Task, VisualScenario } from "../types";
import type WordleSolverExercise from "./Exercise";

export const tasks = [
  {
    id: "first-word" as const,
    name: "Get a correct word displaying",
    description: "Start by guessing the first word from common_words(). If it matches, add it with all correct states.",
    hints: [
      "The first word in the list is always your first guess",
      "Compare it to the target word to build the states"
    ],
    requiredScenarios: ["hole-in-one"],
    bonus: false
  },
  {
    id: "handle-wrong" as const,
    name: "Handle entirely wrong",
    description: "When a guess is entirely wrong, filter it out and try the next word.",
    hints: ["Track which letters are absent", "Filter the word list to exclude words with absent letters"],
    requiredScenarios: ["entirely-wrong"],
    bonus: false
  },
  {
    id: "handle-partial" as const,
    name: "Handle partially right",
    description: "Use correct letter positions to narrow down guesses.",
    hints: ["Track which positions have correct letters", "The next guess must have those letters in those positions"],
    requiredScenarios: ["two-needed", "three-needed", "four-needed"],
    bonus: false
  },
  {
    id: "handle-present" as const,
    name: "Handle present letters",
    description: "Use present (yellow) letters to narrow down guesses further.",
    hints: [
      "Present letters must appear somewhere in the word",
      "But not in the position where they were yellow",
      "Track both where letters must be and where they can't be"
    ],
    requiredScenarios: ["present-1", "present-2", "present-3", "present-4"],
    bonus: false
  },
  {
    id: "bonus" as const,
    name: "Bonus: Handle duplicate letters",
    description: "If a letter appears twice in a guess but only once in the target, only one should be yellow.",
    hints: [
      "Count how many times each letter appears in the target word",
      "Track how many of each letter you've already marked as correct or present",
      "Extra occurrences should be marked absent, not present"
    ],
    requiredScenarios: ["bonus-1", "bonus-2"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "hole-in-one",
    name: "All correct",
    description: "Deal with a first correct guess.",
    taskId: "first-word",
    functionCall: { name: "process_game", args: [] },
    setup(exercise) {
      (exercise as WordleSolverExercise).setTargetWord("which");
    },
    expectations(exercise) {
      const ex = exercise as WordleSolverExercise;
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
    slug: "entirely-wrong",
    name: "One wrong, one right",
    description: "Handle getting a wrong guess",
    taskId: "handle-wrong",
    functionCall: { name: "process_game", args: [] },
    setup(exercise) {
      (exercise as WordleSolverExercise).setTargetWord("about");
    },
    expectations(exercise) {
      const ex = exercise as WordleSolverExercise;
      return [
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) === JSON.stringify(["absent", "absent", "absent", "absent", "absent"]),
          errorHtml: "We expected the first row to be absent"
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(1)) ===
            JSON.stringify(["correct", "correct", "correct", "correct", "correct"]),
          errorHtml: "We expected the second row to be correct"
        }
      ];
    }
  },
  {
    slug: "two-needed",
    name: "Two guesses needed",
    description: "Handle getting a wrong guess",
    taskId: "handle-partial",
    functionCall: { name: "process_game", args: [] },
    setup(exercise) {
      (exercise as WordleSolverExercise).setTargetWord("would");
    },
    expectations(exercise) {
      const ex = exercise as WordleSolverExercise;
      return [
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) === JSON.stringify(["correct", "absent", "absent", "absent", "absent"]),
          errorHtml: "We expected the first row to have one correct"
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(1)) ===
            JSON.stringify(["correct", "correct", "correct", "correct", "correct"]),
          errorHtml: "We expected the second row to be correct"
        }
      ];
    }
  },
  {
    slug: "three-needed",
    name: "Three guesses needed",
    description: "Handle getting a wrong guess",
    taskId: "handle-partial",
    functionCall: { name: "process_game", args: [] },
    setup(exercise) {
      (exercise as WordleSolverExercise).setTargetWord("world");
    },
    expectations(exercise) {
      const ex = exercise as WordleSolverExercise;
      return [
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) === JSON.stringify(["correct", "absent", "absent", "absent", "absent"]),
          errorHtml: "We expected the first row to have one correct"
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(1)) ===
            JSON.stringify(["correct", "correct", "absent", "correct", "correct"]),
          errorHtml: "We expected the second row to have all but one correct"
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(2)) ===
            JSON.stringify(["correct", "correct", "correct", "correct", "correct"]),
          errorHtml: "We expected the third row to be correct"
        }
      ];
    }
  },
  {
    slug: "four-needed",
    name: "Four guesses needed",
    description: "Handle getting a wrong guess",
    taskId: "handle-partial",
    functionCall: { name: "process_game", args: [] },
    setup(exercise) {
      (exercise as WordleSolverExercise).setTargetWord("women");
    },
    expectations(exercise) {
      const ex = exercise as WordleSolverExercise;
      return [
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) === JSON.stringify(["correct", "absent", "absent", "absent", "absent"]),
          errorHtml: "We expected the first row to have one correct"
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(1)) === JSON.stringify(["correct", "correct", "absent", "absent", "absent"]),
          errorHtml: "We expected the second row to have the first two correct"
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(2)) ===
            JSON.stringify(["correct", "correct", "correct", "absent", "correct"]),
          errorHtml: "We expected the third row have four correct"
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(3)) ===
            JSON.stringify(["correct", "correct", "correct", "correct", "correct"]),
          errorHtml: "We expected the fourth row to be correct"
        }
      ];
    }
  },
  {
    slug: "present-1",
    name: "Some letters present",
    description: "A tough one with some letters present.",
    taskId: "handle-present",
    functionCall: { name: "process_game", args: [] },
    setup(exercise) {
      (exercise as WordleSolverExercise).setTargetWord("twice");
    },
    expectations(exercise) {
      const ex = exercise as WordleSolverExercise;
      return [
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) ===
            JSON.stringify(["present", "absent", "correct", "correct", "absent"]),
          errorHtml: "We expected the first row to be present, absent, correct, correct, absent."
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(1)) ===
            JSON.stringify(["correct", "correct", "correct", "correct", "correct"]),
          errorHtml: "We expected the second row to be all correct"
        }
      ];
    }
  },
  {
    slug: "present-2",
    name: "Getting tighter",
    description: "Handle a more difficult word",
    taskId: "handle-present",
    functionCall: { name: "process_game", args: [] },
    setup(exercise) {
      (exercise as WordleSolverExercise).setTargetWord("power");
    },
    expectations(exercise) {
      const ex = exercise as WordleSolverExercise;
      return [
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) === JSON.stringify(["present", "absent", "absent", "absent", "absent"]),
          errorHtml: "We expected the first row to be present, absent, absent, absent, absent"
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(1)) ===
            JSON.stringify(["absent", "present", "absent", "present", "present"]),
          errorHtml: "We expected the second row to be absent, present, absent, present, present"
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(2)) ===
            JSON.stringify(["correct", "correct", "correct", "correct", "correct"]),
          errorHtml: "We expected the third row to be correct"
        }
      ];
    }
  },
  {
    slug: "present-3",
    name: "A more normal journey",
    description: "This feels like Wordle now",
    taskId: "handle-present",
    functionCall: { name: "process_game", args: [] },
    setup(exercise) {
      (exercise as WordleSolverExercise).setTargetWord("magic");
    },
    expectations(exercise) {
      const ex = exercise as WordleSolverExercise;
      return [
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) === JSON.stringify(["absent", "absent", "present", "present", "absent"]),
          errorHtml: "We expected the first row to be absent, absent, present, present, absent."
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(1)) === JSON.stringify(["absent", "absent", "absent", "correct", "correct"]),
          errorHtml: "We expected the second row to be absent, absent, absent, correct, correct"
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(2)) ===
            JSON.stringify(["correct", "absent", "absent", "correct", "correct"]),
          errorHtml: "We expected the third row to be correct, absent, absent, correct, correct"
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(3)) ===
            JSON.stringify(["correct", "correct", "correct", "correct", "correct"]),
          errorHtml: "We expected the fourth row to be correct"
        }
      ];
    }
  },
  {
    slug: "present-4",
    name: "Another close one",
    description: "Its fun how they diverge at the end!",
    taskId: "handle-present",
    functionCall: { name: "process_game", args: [] },
    setup(exercise) {
      (exercise as WordleSolverExercise).setTargetWord("sense");
    },
    expectations(exercise) {
      const ex = exercise as WordleSolverExercise;
      return [
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) === JSON.stringify(["absent", "absent", "absent", "absent", "absent"]),
          errorHtml: "We expected the first row to be absent"
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(1)) === JSON.stringify(["absent", "absent", "absent", "absent", "absent"]),
          errorHtml: "We expected the second row to be absent"
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(2)) === JSON.stringify(["present", "absent", "present", "absent", "absent"]),
          errorHtml: "We expected the third row to be present, absent, present, absent, absent"
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(3)) ===
            JSON.stringify(["correct", "correct", "correct", "present", "present"]),
          errorHtml: "We expected the fourth row to be correct, correct, correct, present, present"
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(4)) ===
            JSON.stringify(["correct", "correct", "correct", "correct", "correct"]),
          errorHtml: "We expected the fifth row to be correct"
        }
      ];
    }
  },
  {
    slug: "bonus-1",
    name: "Only one yellow",
    description: "If there are multiple present letters for only one actual letter, only one should be yellow.",
    taskId: "bonus",
    functionCall: { name: "process_game", args: [] },
    setup(exercise) {
      (exercise as WordleSolverExercise).setTargetWord("clamp");
    },
    expectations(exercise) {
      const ex = exercise as WordleSolverExercise;
      return [
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) === JSON.stringify(["absent", "absent", "absent", "present", "absent"]),
          errorHtml: "We expected only the fourth letter of the first row to be present."
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(1)) === JSON.stringify(["correct", "absent", "present", "absent", "absent"]),
          errorHtml:
            "We expected the second row to be correct, absent, present, absent, absent (This is the tricky one!)"
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(2)) ===
            JSON.stringify(["correct", "correct", "correct", "absent", "absent"]),
          errorHtml: "We expected the third row to be correct, correct, correct, absent, absent"
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(3)) ===
            JSON.stringify(["correct", "correct", "correct", "correct", "correct"]),
          errorHtml: "We expected the fourth row to be correct"
        }
      ];
    }
  },
  {
    slug: "bonus-2",
    name: "Swiss Cheese",
    description: "The swiss in this shows why it's important!",
    taskId: "bonus",
    functionCall: { name: "process_game", args: [] },
    setup(exercise) {
      (exercise as WordleSolverExercise).setTargetWord("swims");
    },
    expectations(exercise) {
      const ex = exercise as WordleSolverExercise;
      return [
        {
          pass:
            JSON.stringify(ex.statesForRow(0)) === JSON.stringify(["present", "absent", "correct", "absent", "absent"]),
          errorHtml: "We expected only the first row to be present, absent, correct, absent, absent."
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(1)) ===
            JSON.stringify(["correct", "correct", "correct", "absent", "absent"]),
          errorHtml: "We expected the second row to be correct, correct, correct, absent, absent"
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(2)) ===
            JSON.stringify(["correct", "correct", "correct", "absent", "absent"]),
          errorHtml: "We expected the third row to be correct, correct, correct, absent, absent."
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(3)) ===
            JSON.stringify(["correct", "correct", "correct", "absent", "correct"]),
          errorHtml:
            "We expected the fourth row to be correct, correct, correct, absent, correct (this is the tricky one!)"
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(4)) ===
            JSON.stringify(["correct", "correct", "correct", "absent", "correct"]),
          errorHtml: "We expected the fifth row to be correct, correct, correct, absent, correct."
        },
        {
          pass:
            JSON.stringify(ex.statesForRow(5)) ===
            JSON.stringify(["correct", "correct", "correct", "correct", "correct"]),
          errorHtml: "We expected the sixth row to be correct."
        }
      ];
    }
  }
];
