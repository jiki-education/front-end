import type { Task, VisualScenario } from "../types";
import type { RelationalSunExercise } from "./Exercise";

export const tasks = [
  {
    id: "position-sun" as const,
    name: "Position the sun",
    description: "Derive sun_x and sun_y using arithmetic, then draw the sky and sun using the variables.",
    hints: [
      "sun_x = canvas_size - gap - sun_radius",
      "sun_y = gap + sun_radius",
      "Draw the sky first, then the sun on top"
    ],
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
            "The sky rectangle is not correct. It should cover the whole canvas: rectangle(0, 0, canvas_size, canvas_size, sky_color)."
        },
        {
          pass: ex.hasCircleAt(75, 25, 15),
          errorHtml:
            "The sun is not positioned correctly. sun_x should be canvas_size - gap - sun_radius, sun_y should be gap + sun_radius."
        }
      ];
    }
  }
];
