import type { Task, VisualScenario } from "../types";
import type { RelationalTrafficLightsExercise } from "./Exercise";

export const tasks = [
  {
    id: "build-relational-traffic-lights" as const,
    name: "Build the relational traffic lights",
    description: "Derive all positions and sizes from the radius variable so the traffic light scales correctly.",
    hints: [],
    requiredScenarios: ["build-relational-traffic-lights"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "build-relational-traffic-lights",
    name: "Build the relational traffic lights",
    description: "Derive all positions and sizes as multiples of radius.",
    taskId: "build-relational-traffic-lights",

    setup(exercise) {
      const ex = exercise as RelationalTrafficLightsExercise;
      ex.setupBackground("https://assets.exercism.org/bootcamp/graphics/relational-traffic-lights.png");
    },

    expectations(exercise) {
      const ex = exercise as RelationalTrafficLightsExercise;

      return [
        {
          pass: ex.hasRectangleAt(30, 10, 40, 80),
          errorHtml:
            "The housing rectangle is either in the wrong place or the wrong size. Check `housingX`, `housingY`, `housingWidth`, and `housingHeight`."
        },
        {
          pass: ex.hasCircleAt(50, 30, 10),
          errorHtml: "The red light is either in the wrong place or the wrong size. Check `centerX` and `redY`."
        },
        {
          pass: ex.hasCircleAt(50, 50, 10),
          errorHtml: "The yellow light is either in the wrong place or the wrong size. Check `centerX` and `yellowY`."
        },
        {
          pass: ex.hasCircleAt(50, 70, 10),
          errorHtml: "The green light is either in the wrong place or the wrong size. Check `centerX` and `greenY`."
        }
      ];
    },

    codeChecks: [
      {
        pass: (result) => result.assertors.assertNoLiteralNumberAssignments({ exclude: ["radius"] }),
        errorHtml: "All position and size variables should be calculated from the radius, not set to plain numbers."
      }
    ]
  }
];
