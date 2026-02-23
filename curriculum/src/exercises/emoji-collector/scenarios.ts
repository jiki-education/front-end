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
    hints: [
      'Use look("down") to check what emoji is on the current square',
      "Keep track of collected emojis in a dictionary",
      "Use hasKey() to check if an emoji is already in your dictionary before adding it",
      "Remember to call removeEmoji() after picking up an emoji",
      "Call announceEmojis() with your dictionary after the loop ends"
    ],
    requiredScenarios: ["diamonds", "faces", "poo", "only-once"],
    bonus: false
  },
  {
    id: "random-emojis" as const,
    name: "Random emojis",
    description: "Handle mazes with random emojis that change each time!",
    hints: ["Your solution from the previous task should work here too"],
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
      ex.setupGrid([
        [1, 1, 1, 1, 2, 1, 1],
        [1, 1, 1, 1, 0, 1, 1],
        [1, 1, 1, 1, "💎", 1, 1],
        [1, 1, 1, 1, 0, 1, 1],
        [1, 1, 1, 1, "💎", 1, 1],
        [1, 1, 1, 1, "💎", 1, 1],
        [1, 1, 1, 1, 3, 1, 1]
      ]);
      ex.setupDirection("down");
      ex.setupPosition(0, 4);
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
      ex.setupGrid([
        [2, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 0, 0, 0, "🤡", 3],
        [0, 1, 1, 1, 0, 1, 1, 1, 1],
        [0, 1, 1, 1, "🥰", 1, 1, 1, 1],
        [0, 0, "🤡", 0, 0, 1, 1, 1, 1],
        [1, 4, 1, 1, 4, 1, 1, 1, 1],
        [1, 4, 4, 4, 4, 1, 1, 1, 1],
        [1, 1, 1, 1, 4, 1, 1, 1, 1]
      ]);
      ex.setupDirection("down");
      ex.setupPosition(0, 0);
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
      ex.setupGrid([
        [2, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 0, 0, 1, 1, 1, 1],
        [0, 1, 1, 1, 0, 0, 0, 0, 1],
        ["🐶", 1, 1, 0, 0, 1, 0, 1, 1],
        [0, 1, 1, 1, 0, 1, 0, 1, 1],
        [0, 0, 0, "🐈", "🐶", 1, 0, 0, 1],
        [1, 4, 1, 1, 0, 1, 1, 5, 1],
        [1, 4, 4, 4, 0, 1, 0, "🐶", 1],
        [1, 1, 1, 1, 3, 1, 1, 1, 1]
      ]);
      ex.setupDirection("down");
      ex.setupPosition(0, 0);
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
      ex.setupGrid([
        [3, 1, 0, 0, 2, 1, 1, 1, 1],
        [0, 1, "🎀", 1, "🩷", 1, 1, 1, 1],
        ["👑", 1, 0, 1, 0, 0, 0, "🩷", 1],
        ["👑", 0, 0, 1, 0, 1, 4, 1, 1],
        [0, 1, 4, 1, 0, 1, 4, 1, 1],
        [5, 0, 0, 1, 0, 1, 4, 1, 1],
        [1, 4, 1, 1, "🩷", 4, 4, 1, 1],
        [1, 4, 4, 4, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1]
      ]);
      ex.setupDirection("down");
      ex.setupPosition(0, 4);
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
      ex.setupGrid([
        [1, 1, 0, 0, 0, 1, 1, 1, 1],
        [3, 1, "🎯", 1, "🎯", 1, 1, 1, 1],
        ["🎯", 1, 0, 1, 0, 0, 0, "🎯", 1],
        ["🎯", 0, 0, 1, 1, 1, 4, 0, 1],
        [0, 1, 0, 1, 1, 0, 4, 0, 1],
        [0, 0, "🎯", 1, 1, 1, 4, 0, 1],
        ["🎯", 5, "🎯", 0, "🎯", 0, 4, "🎯", 1],
        [1, 5, 5, 5, 0, 1, 1, 0, 2],
        [1, 1, 1, 1, 1, 1, 1, 1, 1]
      ]);
      ex.setupDirection("left");
      ex.setupPosition(7, 8);
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
