import type { Task, VisualScenario } from "../types";
import type SpaceInvadersSolveBasicExercise from "./Exercise";

export const tasks = [
  {
    id: "shoot-the-aliens" as const,
    name: "tasks.shootTheAliens.name",
    description: "tasks.shootTheAliens.description",
    hints: [],
    requiredScenarios: ["shoot-the-aliens"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "shoot-the-aliens",
    name: "scenarios.shootTheAliens.name",
    description: "scenarios.shootTheAliens.description",
    taskId: "shoot-the-aliens",

    setup(exercise) {
      const ex = exercise as SpaceInvadersSolveBasicExercise;
      ex.setupAliens([[0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0]]);
    },

    expectations(exercise) {
      const ex = exercise as SpaceInvadersSolveBasicExercise;
      const state = ex.getState();
      return [
        {
          pass: state.gameStatus === "won",
          errorHtml: ex.t("checks.notShotAllAliens")
        }
      ];
    }
  }
];
