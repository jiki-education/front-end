import type { Task, VisualScenario } from "../types";
import type { CloudRainSunExercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-scene" as const,
    name: "Draw the weather scene",
    description: "Create a weather scene with a yellow sun, a white cloud, and blue rain drops.",
    hints: [],
    requiredScenarios: ["draw-scene"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "draw-scene",
    name: "Draw the weather scene",
    description: "Create the complete weather scene with sun, cloud, and rain.",
    taskId: "draw-scene",

    setup(exercise) {
      const ex = exercise as CloudRainSunExercise;
      ex.setupBackground("/static/images/exercise-assets/cloud-rain-sun/template.png");
    },

    expectations(exercise) {
      const ex = exercise as CloudRainSunExercise;

      return [
        {
          pass: ex.hasCircleAt(75, 30, 15),
          errorHtml: "The sun isn't right."
        },
        {
          pass: ex.hasRectangleAt(25, 50, 50, 10),
          errorHtml: "The cloud body isn't right."
        },
        {
          pass: ex.hasCircleAt(25, 50, 10),
          errorHtml: "The left cloud puff isn't right."
        },
        {
          pass: ex.hasCircleAt(40, 40, 15),
          errorHtml: "The left-center cloud puff isn't right."
        },
        {
          pass: ex.hasCircleAt(55, 40, 20),
          errorHtml: "The right-center cloud puff isn't right."
        },
        {
          pass: ex.hasCircleAt(75, 50, 10),
          errorHtml: "The right cloud puff isn't right."
        },
        {
          pass: ex.hasEllipseAt(30, 70, 3, 5),
          errorHtml: "One of the rain drops isn't right."
        },
        {
          pass: ex.hasEllipseAt(50, 70, 3, 5),
          errorHtml: "One of the rain drops isn't right."
        },
        {
          pass: ex.hasEllipseAt(70, 70, 3, 5),
          errorHtml: "One of the rain drops isn't right."
        },
        {
          pass: ex.hasEllipseAt(40, 80, 3, 5),
          errorHtml: "One of the rain drops isn't right."
        },
        {
          pass: ex.hasEllipseAt(60, 80, 3, 5),
          errorHtml: "One of the rain drops isn't right."
        }
      ];
    }
  }
];
