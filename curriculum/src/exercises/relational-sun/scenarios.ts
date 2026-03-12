import type { Task, VisualScenario } from "../types";
import type { RelationalSunExercise } from "./Exercise";

export const tasks = [
  {
    id: "position-sun" as const,
    name: "Position the sun",
    description: "Derive sunX and sunY using arithmetic, then draw the sky and sun using the variables.",
    hints: [
      { question: "I can't work out the radius of the sun", answer: "It's 15." },
      { question: "I can't work out the gap", answer: "It's 10." }
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
      ex.setupBackground("/static/images/exercise-assets/relational-sun/background.png");
    },

    expectations(exercise) {
      const ex = exercise as RelationalSunExercise;

      return [
        {
          pass: ex.hasCircleAt(75, 25, 15),
          errorHtml:
            "The sun is not positioned correctly. sunX should be canvasSize - gap - sunRadius, sunY should be gap + sunRadius."
        }
      ];
    },

    codeChecks: [
      {
        pass: (result) => result.assertors.assertNoLiteralNumbersInAssignments({ include: ["sun_x", "sun_y"] }),
        errorHtml: "Variables like sunX and sunY should be calculated from other variables, not set to plain numbers."
      }
    ]
  }
];
