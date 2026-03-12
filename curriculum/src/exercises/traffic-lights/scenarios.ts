import type { Task, VisualScenario } from "../types";
import type { TrafficLightsExercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-lights" as const,
    name: "Draw the traffic lights",
    description: "Use the provided variables to draw the three colored lights on the traffic light.",
    hints: [],
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
      ex.setupBackground("/static/images/exercise-assets/traffic-lights/background.png");
    },

    expectations(exercise) {
      const ex = exercise as TrafficLightsExercise;

      return [
        {
          pass: ex.hasCircleWithColorAt(50, 16, 8, "#FF0000"),
          errorHtml: "The red light (top) isn't right."
        },
        {
          pass: ex.hasCircleWithColorAt(50, 39, 8, "#FFFF00"),
          errorHtml: "The amber light (middle) isn't right."
        },
        {
          pass: ex.hasCircleWithColorAt(50, 62, 8, "#008000"),
          errorHtml: "The green light (bottom) isn't right."
        }
      ];
    },

    codeChecks: [
      {
        pass: (result) =>
          result.assertors.assertSomeArgumentsAreVariablesForFunction("circle", [true, true, true, false]),
        errorHtml: "You should use the variables rather than using numbers directly as the function inputs."
      }
    ]
  }
];
