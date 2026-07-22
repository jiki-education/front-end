import type { Task, VisualScenario } from "../types";
import type LookAroundExercise from "./Exercise";

export const tasks = [
  {
    id: "straight-path" as const,
    name: "tasks.straightPath.name",
    description: "tasks.straightPath.description",
    hints: [],
    requiredScenarios: ["maze-1"],
    bonus: false
  },
  {
    id: "turn-left" as const,
    name: "tasks.turnLeft.name",
    description: "tasks.turnLeft.description",
    hints: [],
    requiredScenarios: ["left-turn"],
    bonus: false
  },
  {
    id: "turn-right" as const,
    name: "tasks.turnRight.name",
    description: "tasks.turnRight.description",
    hints: [],
    requiredScenarios: ["right-turn", "forks"],
    bonus: false
  },
  {
    id: "turn-around" as const,
    name: "tasks.turnAround.name",
    description: "tasks.turnAround.description",
    hints: [],
    requiredScenarios: ["turn-around", "forks-2", "cover-old-ground"],
    bonus: false
  },
  {
    id: "bonus-challenges" as const,
    name: "tasks.bonusChallenges.name",
    description: "tasks.bonusChallenges.description",
    hints: [],
    requiredScenarios: ["bonus-1", "bonus-2"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "maze-1",
    name: "scenarios.maze1.name",
    description: "scenarios.maze1.description",
    taskId: "straight-path",

    setup(exercise) {
      const ex = exercise as LookAroundExercise;
      ex.setupMaze(
        [
          [1, 1, 1, 1, 2, 1, 1],
          [1, 1, 1, 1, 0, 1, 1],
          [1, 1, 1, 1, 0, 1, 1],
          [1, 1, 1, 1, 0, 1, 1],
          [1, 1, 1, 1, 0, 1, 1],
          [1, 1, 1, 1, 0, 1, 1],
          [1, 1, 1, 1, 3, 1, 1]
        ],
        0,
        4,
        "down"
      );
    },

    expectations(exercise) {
      const ex = exercise as LookAroundExercise;
      return [
        {
          pass: ex.characterRow === 6 && ex.characterCol === 4,
          errorHtml: ex.t("checks.notReachedEnd")
        }
      ];
    }
  },
  {
    slug: "left-turn",
    name: "scenarios.leftTurn.name",
    description: "scenarios.leftTurn.description",
    taskId: "turn-left",

    setup(exercise) {
      const ex = exercise as LookAroundExercise;
      ex.setupMaze(
        [
          [2, 1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 1, 1, 1, 1, 1, 1],
          [0, 0, 0, 0, 0, 0, 0, 0, 3],
          [1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        0,
        0,
        "down"
      );
    },

    expectations(exercise) {
      const ex = exercise as LookAroundExercise;
      return [
        {
          pass: ex.characterRow === 5 && ex.characterCol === 8,
          errorHtml: ex.t("checks.notReachedEnd")
        },
        {
          pass: ex.direction === "right",
          errorHtml: ex.t("checks.extraTurn")
        }
      ];
    }
  },
  {
    slug: "right-turn",
    name: "scenarios.rightTurn.name",
    description: "scenarios.rightTurn.description",
    taskId: "turn-right",

    setup(exercise) {
      const ex = exercise as LookAroundExercise;
      ex.setupMaze(
        [
          [1, 1, 1, 1, 1, 1, 1, 1, 2],
          [1, 1, 1, 1, 1, 1, 1, 1, 0],
          [1, 1, 1, 1, 1, 1, 1, 1, 0],
          [1, 1, 1, 1, 1, 1, 1, 1, 0],
          [1, 1, 1, 1, 1, 1, 1, 1, 0],
          [3, 0, 0, 0, 0, 0, 0, 0, 0],
          [1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        0,
        8,
        "down"
      );
    },

    expectations(exercise) {
      const ex = exercise as LookAroundExercise;
      return [
        {
          pass: ex.characterRow === 5 && ex.characterCol === 0,
          errorHtml: ex.t("checks.notReachedEnd")
        }
      ];
    }
  },
  {
    slug: "forks",
    name: "scenarios.forks.name",
    description: "scenarios.forks.description",
    taskId: "turn-right",

    setup(exercise) {
      const ex = exercise as LookAroundExercise;
      ex.setupMaze(
        [
          [2, 1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 1, 0, 0, 0, 0, 3],
          [0, 1, 1, 1, 0, 1, 1, 1, 1],
          [0, 1, 1, 1, 0, 1, 1, 1, 1],
          [0, 0, 0, 0, 0, 1, 1, 1, 1],
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
      const ex = exercise as LookAroundExercise;
      return [
        {
          pass: ex.characterRow === 2 && ex.characterCol === 8,
          errorHtml: ex.t("checks.notReachedEnd")
        }
      ];
    }
  },
  {
    slug: "turn-around",
    name: "scenarios.turnAround.name",
    description: "scenarios.turnAround.description",
    taskId: "turn-around",

    setup(exercise) {
      const ex = exercise as LookAroundExercise;
      ex.setupMaze(
        [
          [1, 1, 1, 2, 1, 1, 1, 1, 1],
          [1, 1, 1, 0, 1, 1, 1, 1, 1],
          [1, 1, 1, 0, 1, 1, 1, 1, 1],
          [1, 4, 4, 0, 1, 1, 0, 1, 1],
          [1, 4, 1, 0, 1, 1, 0, 1, 1],
          [1, 4, 4, 0, 0, 0, 0, 0, 1],
          [1, 1, 1, 0, 1, 1, 1, 1, 1],
          [3, 0, 0, 0, 1, 1, 1, 1, 1],
          [1, 1, 1, 0, 1, 1, 1, 1, 1]
        ],
        0,
        3,
        "down"
      );
    },

    expectations(exercise) {
      const ex = exercise as LookAroundExercise;
      return [
        {
          pass: ex.characterRow === 7 && ex.characterCol === 0,
          errorHtml: ex.t("checks.notReachedEnd")
        }
      ];
    }
  },
  {
    slug: "forks-2",
    name: "scenarios.forks2.name",
    description: "scenarios.forks2.description",
    taskId: "turn-around",

    setup(exercise) {
      const ex = exercise as LookAroundExercise;
      ex.setupMaze(
        [
          [2, 1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 0, 0, 1, 1, 1, 1],
          [0, 1, 1, 1, 0, 0, 0, 0, 1],
          [0, 1, 1, 0, 0, 1, 0, 1, 1],
          [0, 1, 1, 1, 0, 1, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 0, 0, 1],
          [1, 4, 1, 1, 0, 1, 1, 5, 1],
          [1, 4, 4, 4, 0, 1, 0, 0, 1],
          [1, 1, 1, 1, 3, 1, 1, 1, 1]
        ],
        0,
        0,
        "down"
      );
    },

    expectations(exercise) {
      const ex = exercise as LookAroundExercise;
      return [
        {
          pass: ex.characterRow === 8 && ex.characterCol === 4,
          errorHtml: ex.t("checks.notReachedEnd")
        }
      ];
    },

    // codeChecks[].pass runs against InterpretResult/Language only (see CodeCheck in
    // ../types) — no exercise/translator instance is reachable from this scope, so these
    // checks resolve their error message via errorKey against the exercise's catalog
    // (locales/en/translation.json) later, rather than calling `t` directly.
    codeChecks: [
      {
        pass: (result) => result.assertors.assertFunctionDefined("can_turn_left"),
        errorKey: "checks.canTurnLeftMissing"
      },
      {
        pass: (result) => result.assertors.assertFunctionDefined("can_turn_right"),
        errorKey: "checks.canTurnRightMissing"
      },
      {
        pass: (result) => result.assertors.assertFunctionDefined("can_move"),
        errorKey: "checks.canMoveMissing"
      },
      {
        pass: (result) => result.assertors.assertFunctionDefined("turn_around"),
        errorKey: "checks.turnAroundMissing"
      }
    ]
  },
  {
    slug: "cover-old-ground",
    name: "scenarios.coverOldGround.name",
    description: "scenarios.coverOldGround.description",
    taskId: "turn-around",

    setup(exercise) {
      const ex = exercise as LookAroundExercise;
      ex.setupMaze(
        [
          [3, 1, 0, 0, 2, 1, 1, 1, 1],
          [0, 1, 0, 1, 0, 1, 1, 1, 1],
          [0, 1, 0, 1, 0, 0, 0, 0, 1],
          [0, 0, 0, 1, 0, 1, 4, 1, 1],
          [0, 1, 4, 1, 0, 1, 4, 1, 1],
          [5, 0, 0, 1, 0, 1, 4, 1, 1],
          [1, 4, 1, 1, 0, 4, 4, 1, 1],
          [1, 4, 4, 4, 0, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        0,
        4,
        "down"
      );
    },

    expectations(exercise) {
      const ex = exercise as LookAroundExercise;
      return [
        {
          pass: ex.characterRow === 0 && ex.characterCol === 0,
          errorHtml: ex.t("checks.notReachedEnd")
        }
      ];
    }
  },
  {
    slug: "bonus-1",
    name: "scenarios.bonus1.name",
    description: "scenarios.bonus1.description",
    taskId: "bonus-challenges",

    setup(exercise) {
      const ex = exercise as LookAroundExercise;
      ex.setupMaze(
        [
          [4, 1, 1, 1, 1, 1, 1, 1, 1],
          [0, 0, 0, 0, 0, 0, 0, 0, 1],
          [0, 1, 1, 1, 1, 1, 1, 0, 1],
          [0, 1, 0, 0, 0, 0, 1, 0, 1],
          [0, 1, 0, 1, 1, 3, 1, 0, 1],
          [0, 5, 0, 1, 1, 1, 1, 0, 1],
          [0, 1, 0, 0, 0, 0, 0, 0, 1],
          [0, 1, 1, 1, 1, 1, 1, 5, 1],
          [0, 0, 0, 0, 0, 0, 0, 0, 2]
        ],
        8,
        8,
        "left"
      );
    },

    expectations(exercise) {
      const ex = exercise as LookAroundExercise;
      return [
        {
          pass: ex.characterRow === 4 && ex.characterCol === 5,
          errorHtml: ex.t("checks.notReachedEnd")
        }
      ];
    },

    // See the codeChecks note on the "forks-2" scenario above: no translator instance
    // is reachable here, so this check resolves its message via errorKey.
    codeChecks: [
      {
        pass: (result) => result.assertors.numFunctionCallsInCode("look") === 1,
        errorKey: "checks.lookOnlyOnce"
      }
    ]
  },
  {
    slug: "bonus-2",
    name: "scenarios.bonus2.name",
    description: "scenarios.bonus2.description",
    taskId: "bonus-challenges",

    setup(exercise) {
      const ex = exercise as LookAroundExercise;
      ex.setupMaze(
        [
          [3, 0, 0, 0, 0, 0, 0, 0, 0],
          [1, 1, 1, 1, 0, 1, 1, 1, 1],
          [1, 1, 1, 1, 0, 1, 1, 1, 1],
          [4, 0, 0, 0, 0, 0, 0, 0, 4],
          [1, 1, 1, 1, 0, 1, 1, 1, 1],
          [1, 5, 0, 0, 0, 0, 0, 5, 1],
          [1, 1, 1, 1, 0, 1, 1, 1, 1],
          [1, 1, 1, 0, 0, 0, 1, 1, 1],
          [1, 1, 1, 1, 2, 1, 1, 1, 1]
        ],
        8,
        4,
        "down"
      );
    },

    expectations(exercise) {
      const ex = exercise as LookAroundExercise;
      return [
        {
          pass: ex.characterRow === 0 && ex.characterCol === 0,
          errorHtml: ex.t("checks.notReachedEnd")
        }
      ];
    },

    // See the codeChecks note on the "forks-2" scenario above: no translator instance
    // is reachable here, so this check resolves its message via errorKey.
    codeChecks: [
      {
        // The carried-forward program from maze-turn-around is ~18 lines of code,
        // so adding 13 gives a maximum of 31.
        pass: (result) => result.assertors.assertMaxLinesOfCode(31),
        errorKey: "checks.maxExtraLines"
      }
    ]
  }
];
