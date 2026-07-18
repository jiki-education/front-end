import type { Task, VisualScenario } from "../types";
import type { TrafficLightsExercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-lights" as const,
    name: "tasks.drawLights.name",
    description: "tasks.drawLights.description",
    hints: [],
    requiredScenarios: ["draw-lights"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "draw-lights",
    name: "scenarios.drawLights.name",
    description: "scenarios.drawLights.description",
    taskId: "draw-lights",

    setup(exercise) {
      const ex = exercise as TrafficLightsExercise;
      ex.setupBackground("/static/images/exercise-assets/traffic-lights/background.webp");
    },

    expectations(exercise) {
      const ex = exercise as TrafficLightsExercise;

      return [
        {
          pass: ex.hasCircleWithColorAt(50, 16, 8, "#FF0000"),
          errorHtml: ex.t("checks.redLight")
        },
        {
          pass: ex.hasCircleWithColorAt(50, 39, 8, "#FFFF00"),
          errorHtml: ex.t("checks.amberLight")
        },
        {
          pass: ex.hasCircleWithColorAt(50, 62, 8, "#008000"),
          errorHtml: ex.t("checks.greenLight")
        }
      ];
    },

    codeChecks: [
      {
        pass: (result) =>
          result.assertors.assertSomeArgumentsAreVariablesForFunction("circle", [true, true, true, false]),
        errorKey: "checks.useVariables"
      }
    ]
  }
];
