import type { Task, VisualScenario } from "../types";
import type BouncerExercise from "./Exercise";

export const tasks = [
  {
    id: "check-age" as const,
    name: "Check the person's age",
    description: "Get the person's age and check if they're over 20. If they are, let them in.",
    hints: [],
    requiredScenarios: ["age-25", "age-18", "age-21", "age-20"],
    bonus: false
  }
] as const satisfies readonly Task[];

function setupExercise(exercise: BouncerExercise, age: number) {
  exercise.setupAge(age);
  exercise.setupBackground("/static/images/exercise-assets/bouncer/background.jpg");
  exercise.setupLetInImage("/static/images/exercise-assets/bouncer/open.jpg");
}

export const scenarios: VisualScenario[] = [
  {
    slug: "age-25",
    name: "Age 25",
    description: "The person is 25 years old — they should be let in.",
    taskId: "check-age",

    setup(exercise) {
      setupExercise(exercise as BouncerExercise, 25);
    },

    expectations(exercise) {
      const ex = exercise as BouncerExercise;
      return [
        {
          pass: ex.hasLetIn === true,
          errorHtml: "The person is 25 — they should have been let in, but weren't."
        }
      ];
    }
  },
  {
    slug: "age-18",
    name: "Age 18",
    description: "The person is 18 years old — they should not be let in.",
    taskId: "check-age",

    setup(exercise) {
      setupExercise(exercise as BouncerExercise, 18);
    },

    expectations(exercise) {
      const ex = exercise as BouncerExercise;
      return [
        {
          pass: ex.hasLetIn === false,
          errorHtml: "The person is 18 — they should not have been let in, but were."
        }
      ];
    }
  },
  {
    slug: "age-21",
    name: "Age 21",
    description: "The person is 21 years old — just above 20, they should be let in.",
    taskId: "check-age",

    setup(exercise) {
      setupExercise(exercise as BouncerExercise, 21);
    },

    expectations(exercise) {
      const ex = exercise as BouncerExercise;
      return [
        {
          pass: ex.hasLetIn === true,
          errorHtml: "The person is 21 — they should have been let in, but weren't."
        }
      ];
    }
  },
  {
    slug: "age-20",
    name: "Age 20",
    description: "The person is exactly 20 — not over 20, so they should not be let in.",
    taskId: "check-age",

    setup(exercise) {
      setupExercise(exercise as BouncerExercise, 20);
    },

    expectations(exercise) {
      const ex = exercise as BouncerExercise;
      return [
        {
          pass: ex.hasLetIn === false,
          errorHtml: "The person is exactly 20 — not over 20, so they should not have been let in, but were."
        }
      ];
    }
  }
];
