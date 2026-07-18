import type { Task, VisualScenario } from "../types";
import type BouncerExercise from "./Exercise";

export const tasks = [
  {
    id: "check-age" as const,
    name: "tasks.checkAge.name",
    description: "tasks.checkAge.description",
    hints: [],
    requiredScenarios: ["age-25", "age-18", "age-21", "age-20"],
    bonus: false
  }
] as const satisfies readonly Task[];

function setupExercise(exercise: BouncerExercise, age: number) {
  exercise.setupAge(age);
  exercise.setupBackground("/static/images/exercise-assets/bouncer/background.webp");
  exercise.setupLetInImage("/static/images/exercise-assets/bouncer/open.webp");
}

export const scenarios: VisualScenario[] = [
  {
    slug: "age-25",
    name: "scenarios.age25.name",
    description: "scenarios.age25.description",
    taskId: "check-age",

    setup(exercise) {
      setupExercise(exercise as BouncerExercise, 25);
    },

    expectations(exercise) {
      const ex = exercise as BouncerExercise;
      return [
        {
          pass: ex.hasLetIn === true,
          errorHtml: ex.t("checks.age25NotLetIn")
        }
      ];
    }
  },
  {
    slug: "age-18",
    name: "scenarios.age18.name",
    description: "scenarios.age18.description",
    taskId: "check-age",

    setup(exercise) {
      setupExercise(exercise as BouncerExercise, 18);
    },

    expectations(exercise) {
      const ex = exercise as BouncerExercise;
      return [
        {
          pass: ex.hasLetIn === false,
          errorHtml: ex.t("checks.age18LetIn")
        }
      ];
    }
  },
  {
    slug: "age-21",
    name: "scenarios.age21.name",
    description: "scenarios.age21.description",
    taskId: "check-age",

    setup(exercise) {
      setupExercise(exercise as BouncerExercise, 21);
    },

    expectations(exercise) {
      const ex = exercise as BouncerExercise;
      return [
        {
          pass: ex.hasLetIn === true,
          errorHtml: ex.t("checks.age21NotLetIn")
        }
      ];
    }
  },
  {
    slug: "age-20",
    name: "scenarios.age20.name",
    description: "scenarios.age20.description",
    taskId: "check-age",

    setup(exercise) {
      setupExercise(exercise as BouncerExercise, 20);
    },

    expectations(exercise) {
      const ex = exercise as BouncerExercise;
      return [
        {
          pass: ex.hasLetIn === false,
          errorHtml: ex.t("checks.age20LetIn")
        }
      ];
    }
  }
];
