import type { Task, VisualScenario } from "../types";
import type MazeAutomatedSolveExercise from "./Exercise";

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
    requiredScenarios: ["turn-around", "forks-2"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "maze-1",
    name: "scenarios.maze1.name",
    description: "scenarios.maze1.description",
    taskId: "straight-path",

    setup(exercise) {
      const ex = exercise as MazeAutomatedSolveExercise;
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
      const ex = exercise as MazeAutomatedSolveExercise;
      return [
        {
          pass: ex.characterRow === 6 && ex.characterCol === 4,
          errorHtml: ex.t("checks.reachedEnd")
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
      const ex = exercise as MazeAutomatedSolveExercise;
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
      const ex = exercise as MazeAutomatedSolveExercise;
      return [
        {
          pass: ex.characterRow === 5 && ex.characterCol === 8,
          errorHtml: ex.t("checks.reachedEnd")
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
      const ex = exercise as MazeAutomatedSolveExercise;
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
      const ex = exercise as MazeAutomatedSolveExercise;
      return [
        {
          pass: ex.characterRow === 5 && ex.characterCol === 0,
          errorHtml: ex.t("checks.reachedEnd")
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
      const ex = exercise as MazeAutomatedSolveExercise;
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
      const ex = exercise as MazeAutomatedSolveExercise;
      return [
        {
          pass: ex.characterRow === 2 && ex.characterCol === 8,
          errorHtml: ex.t("checks.reachedEnd")
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
      const ex = exercise as MazeAutomatedSolveExercise;
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
      const ex = exercise as MazeAutomatedSolveExercise;
      return [
        {
          pass: ex.characterRow === 7 && ex.characterCol === 0,
          errorHtml: ex.t("checks.reachedEnd")
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
      const ex = exercise as MazeAutomatedSolveExercise;
      ex.setupMaze(
        [
          [2, 1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 0, 0, 1, 1, 1, 1],
          [0, 1, 1, 1, 0, 0, 0, 0, 1],
          [0, 1, 1, 0, 0, 1, 0, 1, 1],
          [0, 1, 1, 1, 0, 1, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 0, 0, 1],
          [1, 4, 1, 1, 0, 1, 1, 0, 1],
          [1, 4, 4, 4, 0, 1, 0, 0, 1],
          [1, 1, 1, 1, 3, 1, 1, 1, 1]
        ],
        0,
        0,
        "down"
      );
    },

    expectations(exercise) {
      const ex = exercise as MazeAutomatedSolveExercise;
      return [
        {
          pass: ex.characterRow === 8 && ex.characterCol === 4,
          errorHtml: ex.t("checks.reachedEnd")
        }
      ];
    }
  }
];
