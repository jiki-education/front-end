import type { Task, VisualScenario } from "../types";
import type EmojiCollectorExercise from "./Exercise";

function emojisMatch(actual: Record<string, number>, expected: Record<string, number>): boolean {
  const actualKeys = Object.keys(actual);
  const expectedKeys = Object.keys(expected);
  if (actualKeys.length !== expectedKeys.length) return false;
  return expectedKeys.every((k) => actual[k] === expected[k]);
}

// Formats an emoji dictionary to match the historical errorHtml rendering, e.g. {"💎": 3}
function formatEmojiDict(dict: Record<string, number>): string {
  return `{${Object.entries(dict)
    .map(([key, value]) => `"${key}": ${value}`)
    .join(", ")}}`;
}

export const tasks = [
  {
    id: "collect-emojis" as const,
    name: "tasks.collectEmojis.name",
    description: "tasks.collectEmojis.description",
    hints: [],
    requiredScenarios: ["diamonds", "faces", "poo", "only-once"],
    bonus: false
  },
  {
    id: "random-emojis" as const,
    name: "tasks.randomEmojis.name",
    description: "tasks.randomEmojis.description",
    hints: [],
    requiredScenarios: ["random-emojis"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "diamonds",
    name: "scenarios.diamonds.name",
    description: "scenarios.diamonds.description",
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
          errorHtml: ex.t("checks.notReachedEnd")
        },
        {
          pass: emojisMatch(ex.collectedEmojis, { "💎": 3 }),
          errorHtml: ex.t("checks.wrongEmojis", { expected: formatEmojiDict({ "💎": 3 }) })
        }
      ];
    }
  },
  {
    slug: "faces",
    name: "scenarios.faces.name",
    description: "scenarios.faces.description",
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
          errorHtml: ex.t("checks.notReachedEnd")
        },
        {
          pass: emojisMatch(ex.collectedEmojis, { "🤡": 2, "🥰": 1 }),
          errorHtml: ex.t("checks.wrongEmojis", { expected: formatEmojiDict({ "🤡": 2, "🥰": 1 }) })
        }
      ];
    }
  },
  {
    slug: "poo",
    name: "scenarios.poo.name",
    description: "scenarios.poo.description",
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
          errorHtml: ex.t("checks.notReachedEnd")
        },
        {
          pass: emojisMatch(ex.collectedEmojis, { "🐈": 1, "🐶": 2 }),
          errorHtml: ex.t("checks.wrongEmojis", { expected: formatEmojiDict({ "🐈": 1, "🐶": 2 }) })
        }
      ];
    }
  },
  {
    slug: "only-once",
    name: "scenarios.onlyOnce.name",
    description: "scenarios.onlyOnce.description",
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
          errorHtml: ex.t("checks.notReachedEnd")
        },
        {
          pass: emojisMatch(ex.collectedEmojis, { "🩷": 3, "🎀": 1, "👑": 2 }),
          errorHtml: ex.t("checks.wrongEmojis", { expected: formatEmojiDict({ "🩷": 3, "🎀": 1, "👑": 2 }) })
        }
      ];
    }
  },
  {
    slug: "random-emojis",
    name: "scenarios.randomEmojis.name",
    description: "scenarios.randomEmojis.description",
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
          errorHtml: ex.t("checks.notReachedEnd")
        },
        {
          pass: Object.keys(ex.collectedEmojis).length > 0,
          errorHtml: ex.t("checks.reportedIncorrectly")
        }
      ];
    }
  }
];
