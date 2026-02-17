import type { Task, VisualScenario } from "../types";
import type { RelationalTrafficLightsExercise } from "./Exercise";

export const tasks = [
  {
    id: "build-relational-traffic-lights" as const,
    name: "Build the relational traffic lights",
    description: "Derive all positions and sizes from the radius variable so the traffic light scales correctly.",
    hints: [
      "All derived variables should be radius * something",
      "The lights are spaced 2 radii apart vertically",
      "The housing surrounds the lights with padding equal to the radius"
    ],
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
            "The housing rectangle is not correct. It should be at (radius*3, radius) with width radius*4 and height radius*8."
        },
        {
          pass: ex.hasCircleAt(50, 30, 10),
          errorHtml: "The red light is not correct. center_x should be radius*5, red_y should be radius*3."
        },
        {
          pass: ex.hasCircleAt(50, 50, 10),
          errorHtml: "The yellow light is not correct. center_x should be radius*5, yellow_y should be radius*5."
        },
        {
          pass: ex.hasCircleAt(50, 70, 10),
          errorHtml: "The green light is not correct. center_x should be radius*5, green_y should be radius*7."
        }
      ];
    },

    codeChecks: [
      {
        pass: (result) => result.assertors.assertNoLiteralNumberAssignments(["radius"]),
        errorHtml: "All position and size variables should be calculated from the radius, not set to plain numbers."
      }
    ]
  }
];
