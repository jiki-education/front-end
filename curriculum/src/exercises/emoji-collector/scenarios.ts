import type { Task, VisualScenario } from "../types";
import type EmojiCollectorExercise from "./Exercise";

function emojisMatch(actual: Record<string, number>, expected: Record<string, number>): boolean {
  const actualKeys = Object.keys(actual);
  const expectedKeys = Object.keys(expected);
  if (actualKeys.length !== expectedKeys.length) return false;
  return expectedKeys.every((k) => actual[k] === expected[k]);
}

export const tasks = [
  {
    id: "collect-emojis" as const,
    name: "Collect emojis",
    description:
      "Navigate the maze, collecting emojis along the way, and announce your collection when you reach the finish.",
    hints: [],
    requiredScenarios: ["diamonds", "faces", "poo", "only-once"],
    bonus: false
  },
  {
    id: "random-emojis" as const,
    name: "Random emojis",
    description: "Handle mazes with random emojis that change each time!",
    hints: [],
    requiredScenarios: ["random-emojis"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "diamonds",
    name: "Collect the diamonds",
    description: "Collect and announce the diamonds.",
    taskId: "collect-emojis",

    setup(exercise) {
      const ex = exercise as EmojiCollectorExercise;
      ex.enableEmojiMode();
      ex.setupMaze(
        [
          [1, 1, 1, 1, 2, 1, 1],
          [1, 1, 1, 1, 0, 1, 1],
          [1, 1, 1, 1, "💎", 1, 1],
          [1, 1, 1, 1, 0, 1, 1],
          [1, 1, 1, 1, "💎", 1, 1],
          [1, 1, 1, 1, "💎", 1, 1],
          [1, 1, 1, 1, 3, 1, 1]
        ],
        0,
        4,
        "down"
      );
    },

    expectations(exercise) {
      const ex = exercise as EmojiCollectorExercise;
      return [
        {
          pass: ex.characterRow === 6 && ex.characterCol === 4,
          errorHtml: "You didn't reach the end of the maze."
        },
        {
          pass: emojisMatch(ex.collectedEmojis, { "💎": 3 }),
          errorHtml:
            'You didn\'t report the collected emojis correctly. We expected you to report: <br/><code>{"💎": 3}</code>'
        }
      ];
    }
  },
  {
    slug: "faces",
    name: "Two types of emojis!",
    description: "Collect two types of emojis this time!",
    taskId: "collect-emojis",

    setup(exercise) {
      const ex = exercise as EmojiCollectorExercise;
      ex.enableEmojiMode();
      ex.setupMaze(
        [
          [2, 1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 1, 0, 0, 0, "🤡", 3],
          [0, 1, 1, 1, 0, 1, 1, 1, 1],
          [0, 1, 1, 1, "🥰", 1, 1, 1, 1],
          [0, 0, "🤡", 0, 0, 1, 1, 1, 1],
          [1, 4, 1, 1, 4, 1, 1, 1, 1],
          [1, 4, 4, 4, 4, 1, 1, 1, 1],
          [1, 1, 1, 1, 4, 1, 1, 1, 1]
        ],
        0,
        0,
        "down"
      );
    },

    expectations(exercise) {
      const ex = exercise as EmojiCollectorExercise;
      return [
        {
          pass: ex.characterRow === 2 && ex.characterCol === 8,
          errorHtml: "You didn't reach the end of the maze."
        },
        {
          pass: emojisMatch(ex.collectedEmojis, { "🤡": 2, "🥰": 1 }),
          errorHtml:
            'You didn\'t report the collected emojis correctly. We expected you to report: <br/><code>{"🤡": 2, "🥰": 1}</code>'
        }
      ];
    }
  },
  {
    slug: "poo",
    name: "Watch out!",
    description: "Collect the animals - not their waste!",
    taskId: "collect-emojis",

    setup(exercise) {
      const ex = exercise as EmojiCollectorExercise;
      ex.enableEmojiMode();
      ex.setupMaze(
        [
          [2, 1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 0, 0, 1, 1, 1, 1],
          [0, 1, 1, 1, 0, 0, 0, 0, 1],
          ["🐶", 1, 1, 0, 0, 1, 0, 1, 1],
          [0, 1, 1, 1, 0, 1, 0, 1, 1],
          [0, 0, 0, "🐈", "🐶", 1, 0, 0, 1],
          [1, 4, 1, 1, 0, 1, 1, 5, 1],
          [1, 4, 4, 4, 0, 1, 0, "🐶", 1],
          [1, 1, 1, 1, 3, 1, 1, 1, 1]
        ],
        0,
        0,
        "down"
      );
    },

    expectations(exercise) {
      const ex = exercise as EmojiCollectorExercise;
      return [
        {
          pass: ex.characterRow === 8 && ex.characterCol === 4,
          errorHtml: "You didn't reach the end of the maze."
        },
        {
          pass: emojisMatch(ex.collectedEmojis, { "🐈": 1, "🐶": 2 }),
          errorHtml:
            'You didn\'t report the collected emojis correctly. We expected you to report: <br/><code>{"🐈": 1, "🐶": 2}</code>'
        }
      ];
    }
  },
  {
    slug: "only-once",
    name: "Only once!",
    description: "Make sure you only collect things once!",
    taskId: "collect-emojis",

    setup(exercise) {
      const ex = exercise as EmojiCollectorExercise;
      ex.enableEmojiMode();
      ex.setupMaze(
        [
          [3, 1, 0, 0, 2, 1, 1, 1, 1],
          [0, 1, "🎀", 1, "🩷", 1, 1, 1, 1],
          ["👑", 1, 0, 1, 0, 0, 0, "🩷", 1],
          ["👑", 0, 0, 1, 0, 1, 4, 1, 1],
          [0, 1, 4, 1, 0, 1, 4, 1, 1],
          [5, 0, 0, 1, 0, 1, 4, 1, 1],
          [1, 4, 1, 1, "🩷", 4, 4, 1, 1],
          [1, 4, 4, 4, 0, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        0,
        4,
        "down"
      );
    },

    expectations(exercise) {
      const ex = exercise as EmojiCollectorExercise;
      return [
        {
          pass: ex.characterRow === 0 && ex.characterCol === 0,
          errorHtml: "You didn't reach the end of the maze."
        },
        {
          pass: emojisMatch(ex.collectedEmojis, { "🩷": 3, "🎀": 1, "👑": 2 }),
          errorHtml:
            'You didn\'t report the collected emojis correctly. We expected you to report: <br/><code>{"🩷": 3, "🎀": 1, "👑": 2}</code>'
        }
      ];
    }
  },
  {
    slug: "random-emojis",
    name: "Random Emojis!",
    description: "Different emojis every time!",
    taskId: "random-emojis",

    setup(exercise) {
      const ex = exercise as EmojiCollectorExercise;
      ex.enableEmojiMode();
      ex.setupMaze(
        [
          [1, 1, 0, 0, 0, 1, 1, 1, 1],
          [3, 1, "🎯", 1, "🎯", 1, 1, 1, 1],
          ["🎯", 1, 0, 1, 0, 0, 0, "🎯", 1],
          ["🎯", 0, 0, 1, 1, 1, 4, 0, 1],
          [0, 1, 0, 1, 1, 0, 4, 0, 1],
          [0, 0, "🎯", 1, 1, 1, 4, 0, 1],
          ["🎯", 5, "🎯", 0, "🎯", 0, 4, "🎯", 1],
          [1, 5, 5, 5, 0, 1, 1, 0, 2],
          [1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        7,
        8,
        "left"
      );
    },

    expectations(exercise) {
      const ex = exercise as EmojiCollectorExercise;
      return [
        {
          pass: ex.characterRow === 1 && ex.characterCol === 0,
          errorHtml: "You didn't reach the end of the maze."
        },
        {
          pass: Object.keys(ex.collectedEmojis).length > 0,
          errorHtml: "You didn't report the collected emojis correctly."
        }
      ];
    }
  }
];
