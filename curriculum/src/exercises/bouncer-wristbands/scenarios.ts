import type { Task, VisualScenario } from "../types";
import type BouncerWristbandsExercise from "./Exercise";

const IMAGE_BASE = "/static/images/exercise-assets/bouncer-wristbands";

type WristbandType = "child" | "teen" | "adult" | "senior";

function setupScenario(exercise: BouncerWristbandsExercise, age: number, expected: WristbandType) {
  exercise.setupAge(age);
  exercise.setupImages(
    `${IMAGE_BASE}/child.webp`,
    `${IMAGE_BASE}/teen.webp`,
    `${IMAGE_BASE}/adult.webp`,
    `${IMAGE_BASE}/senior.webp`
  );
  exercise.setupExpectedWristband(expected);
}

export const tasks = [
  {
    id: "assign-wristband" as const,
    name: "tasks.assignWristband.name",
    description: "tasks.assignWristband.description",
    hints: [],
    requiredScenarios: [
      "child-age-8",
      "teen-age-15",
      "adult-age-30",
      "senior-age-70",
      "boundary-13",
      "boundary-18",
      "boundary-65"
    ],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "child-age-8",
    name: "scenarios.childAge8.name",
    description: "scenarios.childAge8.description",
    taskId: "assign-wristband",

    setup(exercise) {
      setupScenario(exercise as BouncerWristbandsExercise, 8, "child");
    },

    expectations(exercise) {
      const ex = exercise as BouncerWristbandsExercise;
      return [
        {
          pass: ex.wristband === "child",
          errorHtml: ex.t("checks.childWristband", { got: ex.wristband ?? "none" })
        }
      ];
    }
  },
  {
    slug: "teen-age-15",
    name: "scenarios.teenAge15.name",
    description: "scenarios.teenAge15.description",
    taskId: "assign-wristband",

    setup(exercise) {
      setupScenario(exercise as BouncerWristbandsExercise, 15, "teen");
    },

    expectations(exercise) {
      const ex = exercise as BouncerWristbandsExercise;
      return [
        {
          pass: ex.wristband === "teen",
          errorHtml: ex.t("checks.teenWristband", { got: ex.wristband ?? "none" })
        }
      ];
    }
  },
  {
    slug: "adult-age-30",
    name: "scenarios.adultAge30.name",
    description: "scenarios.adultAge30.description",
    taskId: "assign-wristband",

    setup(exercise) {
      setupScenario(exercise as BouncerWristbandsExercise, 30, "adult");
    },

    expectations(exercise) {
      const ex = exercise as BouncerWristbandsExercise;
      return [
        {
          pass: ex.wristband === "adult",
          errorHtml: ex.t("checks.adultWristband", { got: ex.wristband ?? "none" })
        }
      ];
    }
  },
  {
    slug: "senior-age-70",
    name: "scenarios.seniorAge70.name",
    description: "scenarios.seniorAge70.description",
    taskId: "assign-wristband",

    setup(exercise) {
      setupScenario(exercise as BouncerWristbandsExercise, 70, "senior");
    },

    expectations(exercise) {
      const ex = exercise as BouncerWristbandsExercise;
      return [
        {
          pass: ex.wristband === "senior",
          errorHtml: ex.t("checks.seniorWristband", { got: ex.wristband ?? "none" })
        }
      ];
    }
  },
  {
    slug: "boundary-13",
    name: "scenarios.boundary13.name",
    description: "scenarios.boundary13.description",
    taskId: "assign-wristband",

    setup(exercise) {
      setupScenario(exercise as BouncerWristbandsExercise, 13, "teen");
    },

    expectations(exercise) {
      const ex = exercise as BouncerWristbandsExercise;
      return [
        {
          pass: ex.wristband === "teen",
          errorHtml: ex.t("checks.boundary13", { got: ex.wristband ?? "none" })
        }
      ];
    }
  },
  {
    slug: "boundary-18",
    name: "scenarios.boundary18.name",
    description: "scenarios.boundary18.description",
    taskId: "assign-wristband",

    setup(exercise) {
      setupScenario(exercise as BouncerWristbandsExercise, 18, "adult");
    },

    expectations(exercise) {
      const ex = exercise as BouncerWristbandsExercise;
      return [
        {
          pass: ex.wristband === "adult",
          errorHtml: ex.t("checks.boundary18", { got: ex.wristband ?? "none" })
        }
      ];
    }
  },
  {
    slug: "boundary-65",
    name: "scenarios.boundary65.name",
    description: "scenarios.boundary65.description",
    taskId: "assign-wristband",

    setup(exercise) {
      setupScenario(exercise as BouncerWristbandsExercise, 65, "senior");
    },

    expectations(exercise) {
      const ex = exercise as BouncerWristbandsExercise;
      return [
        {
          pass: ex.wristband === "senior",
          errorHtml: ex.t("checks.boundary65", { got: ex.wristband ?? "none" })
        }
      ];
    }
  }
];
