import type { Task, VisualScenario } from "../types";
import type { RelationalSunExercise } from "./Exercise";

export const tasks = [
  {
    id: "position-sun" as const,
    name: "Position the sun",
    description: "Derive sunX and sunY using arithmetic, then draw the sky and sun using the variables.",
    hints: ["sunX = canvasSize - gap - sunRadius", "sunY = gap + sunRadius", "Draw the sky first, then the sun on top"],
    requiredScenarios: ["position-sun"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "position-sun",
    name: "Position the sun",
    description: "Derive the sun position and draw the scene using variables.",
    taskId: "position-sun",

    setup(exercise) {
      const ex = exercise as RelationalSunExercise;
      ex.setupBackground("https://assets.exercism.org/bootcamp/graphics/relational-sun.png");
    },

    expectations(exercise) {
      const ex = exercise as RelationalSunExercise;

      return [
        {
          pass: ex.hasRectangleAt(0, 0, 100, 100),
          errorHtml:
            "The sky rectangle is not correct. It should cover the whole canvas: rectangle(0, 0, canvasSize, canvasSize, skyColor)."
        },
        {
          pass: ex.hasCircleAt(75, 25, 15),
          errorHtml:
            "The sun is not positioned correctly. sunX should be canvasSize - gap - sunRadius, sunY should be gap + sunRadius."
        }
      ];
    },

    codeChecks: [
      {
        pass: (result) => result.assertors.assertNoLiteralNumberAssignments(["canvas_size", "gap", "sun_radius"]),
        errorHtml: "Variables like sunX and sunY should be calculated from other variables, not set to plain numbers."
      }
    ]
  }
];
