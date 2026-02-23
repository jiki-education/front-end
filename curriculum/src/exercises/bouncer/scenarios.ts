import type { Task, VisualScenario } from "../types";
import type BouncerExercise from "./Exercise";

export const tasks = [
  {
    id: "check-age" as const,
    name: "Check the person's age",
    description: "Get the person's age and check if they're over 20. If they are, open the door to let them in.",
    hints: [
      "Use getAge() to find out the person's age",
      "Use an if statement to check if age > 20",
      "Call openDoor() inside the if block"
    ],
    requiredScenarios: ["age-25", "age-18", "age-21", "age-20"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "age-25",
    name: "Age 25 (should open)",
    description: "The person is 25 years old — they should be let in.",
    taskId: "check-age",

    setup(exercise) {
      const ex = exercise as BouncerExercise;
      ex.setupAge(25);
      ex.setupImages(
        "https://assets.exercism.org/bootcamp/graphics/bouncer-closed.png",
        "https://assets.exercism.org/bootcamp/graphics/bouncer-open.png"
      );
    },

    expectations(exercise) {
      const ex = exercise as BouncerExercise;
      return [
        {
          pass: ex.doorOpened === true,
          errorHtml: "The person is 25 — the door should be opened, but it wasn't."
        }
      ];
    }
  },
  {
    slug: "age-18",
    name: "Age 18 (should not open)",
    description: "The person is 18 years old — they should not be let in.",
    taskId: "check-age",

    setup(exercise) {
      const ex = exercise as BouncerExercise;
      ex.setupAge(18);
      ex.setupImages(
        "https://assets.exercism.org/bootcamp/graphics/bouncer-closed.png",
        "https://assets.exercism.org/bootcamp/graphics/bouncer-open.png"
      );
    },

    expectations(exercise) {
      const ex = exercise as BouncerExercise;
      return [
        {
          pass: ex.doorOpened === false,
          errorHtml: "The person is 18 — the door should stay closed, but it was opened."
        }
      ];
    }
  },
  {
    slug: "age-21",
    name: "Age 21 (just above — should open)",
    description: "The person is 21 years old — just above 20, they should be let in.",
    taskId: "check-age",

    setup(exercise) {
      const ex = exercise as BouncerExercise;
      ex.setupAge(21);
      ex.setupImages(
        "https://assets.exercism.org/bootcamp/graphics/bouncer-closed.png",
        "https://assets.exercism.org/bootcamp/graphics/bouncer-open.png"
      );
    },

    expectations(exercise) {
      const ex = exercise as BouncerExercise;
      return [
        {
          pass: ex.doorOpened === true,
          errorHtml: "The person is 21 — the door should be opened, but it wasn't."
        }
      ];
    }
  },
  {
    slug: "age-20",
    name: "Age 20 (boundary — should not open)",
    description: "The person is exactly 20 — not over 20, so they should not be let in.",
    taskId: "check-age",

    setup(exercise) {
      const ex = exercise as BouncerExercise;
      ex.setupAge(20);
      ex.setupImages(
        "https://assets.exercism.org/bootcamp/graphics/bouncer-closed.png",
        "https://assets.exercism.org/bootcamp/graphics/bouncer-open.png"
      );
    },

    expectations(exercise) {
      const ex = exercise as BouncerExercise;
      return [
        {
          pass: ex.doorOpened === false,
          errorHtml: "The person is exactly 20 — not over 20, so the door should stay closed, but it was opened."
        }
      ];
    }
  }
];
