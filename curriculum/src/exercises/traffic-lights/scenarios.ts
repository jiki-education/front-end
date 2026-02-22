import type { Task, VisualScenario } from "../types";
import type { TrafficLightsExercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-lights" as const,
    name: "Draw the traffic lights",
    description: "Use the provided variables to draw the three colored lights on the traffic light.",
    hints: [
      "Use circle(centerX, topY, radius, color) for each light",
      "Red goes at topY, yellow at middleY, green at bottomY",
      "The color is the last argument to circle"
    ],
    requiredScenarios: ["draw-lights"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "draw-lights",
    name: "Draw the traffic lights",
    description: "Draw the three colored circles using the provided variables.",
    taskId: "draw-lights",

    setup(exercise) {
      const ex = exercise as TrafficLightsExercise;
      ex.setupBackground("https://assets.exercism.org/bootcamp/graphics/traffic-lights.png");
    },

    expectations(exercise) {
      const ex = exercise as TrafficLightsExercise;

      return [
        {
          pass: ex.hasRectangleAt(0, 0, 100, 100),
          errorHtml: "The background rectangle is missing. It should be at (0, 0) with width 100 and height 100."
        },
        {
          pass: ex.hasRectangleAt(30, 10, 40, 80),
          errorHtml: "The traffic light housing is missing. It should be at (30, 10) with width 40 and height 80."
        },
        {
          pass: ex.hasCircleAt(50, 25, 10),
          errorHtml: "The red light (top) is not correct. Use circle(centerX, topY, radius, color)."
        },
        {
          pass: ex.hasCircleAt(50, 50, 10),
          errorHtml: "The yellow light (middle) is not correct. Use circle(centerX, middleY, radius, color)."
        },
        {
          pass: ex.hasCircleAt(50, 75, 10),
          errorHtml: "The green light (bottom) is not correct. Use circle(centerX, bottomY, radius, color)."
        }
      ];
    }
  }
];
