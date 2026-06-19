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
    name: "Assign the correct wristband",
    description:
      "Get the person's age and give them the correct wristband: child (under 13), teen (13-17), adult (18-64), or senior (65+).",
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
    name: "Age 8 (child)",
    description: "An 8-year-old. They should get a child wristband.",
    taskId: "assign-wristband",

    setup(exercise) {
      setupScenario(exercise as BouncerWristbandsExercise, 8, "child");
    },

    expectations(exercise) {
      const ex = exercise as BouncerWristbandsExercise;
      return [
        {
          pass: ex.wristband === "child",
          errorHtml: `The person is 8. They should get a child wristband, but got: ${ex.wristband ?? "none"}.`
        }
      ];
    }
  },
  {
    slug: "teen-age-15",
    name: "Age 15 (teen)",
    description: "A 15-year-old. They should get a teen wristband.",
    taskId: "assign-wristband",

    setup(exercise) {
      setupScenario(exercise as BouncerWristbandsExercise, 15, "teen");
    },

    expectations(exercise) {
      const ex = exercise as BouncerWristbandsExercise;
      return [
        {
          pass: ex.wristband === "teen",
          errorHtml: `The person is 15. They should get a teen wristband, but got: ${ex.wristband ?? "none"}.`
        }
      ];
    }
  },
  {
    slug: "adult-age-30",
    name: "Age 30 (adult)",
    description: "A 30-year-old. They should get an adult wristband.",
    taskId: "assign-wristband",

    setup(exercise) {
      setupScenario(exercise as BouncerWristbandsExercise, 30, "adult");
    },

    expectations(exercise) {
      const ex = exercise as BouncerWristbandsExercise;
      return [
        {
          pass: ex.wristband === "adult",
          errorHtml: `The person is 30. They should get an adult wristband, but got: ${ex.wristband ?? "none"}.`
        }
      ];
    }
  },
  {
    slug: "senior-age-70",
    name: "Age 70 (senior)",
    description: "A 70-year-old. They should get a senior wristband.",
    taskId: "assign-wristband",

    setup(exercise) {
      setupScenario(exercise as BouncerWristbandsExercise, 70, "senior");
    },

    expectations(exercise) {
      const ex = exercise as BouncerWristbandsExercise;
      return [
        {
          pass: ex.wristband === "senior",
          errorHtml: `The person is 70. They should get a senior wristband, but got: ${ex.wristband ?? "none"}.`
        }
      ];
    }
  },
  {
    slug: "boundary-13",
    name: "Age 13 (teen)",
    description: "Exactly 13. They're a teen, not a child.",
    taskId: "assign-wristband",

    setup(exercise) {
      setupScenario(exercise as BouncerWristbandsExercise, 13, "teen");
    },

    expectations(exercise) {
      const ex = exercise as BouncerWristbandsExercise;
      return [
        {
          pass: ex.wristband === "teen",
          errorHtml: `The person is 13. They should get a teen wristband (13 is not under 13), but got: ${ex.wristband ?? "none"}.`
        }
      ];
    }
  },
  {
    slug: "boundary-18",
    name: "Age 18 (adult)",
    description: "Exactly 18. They're an adult, not a teen.",
    taskId: "assign-wristband",

    setup(exercise) {
      setupScenario(exercise as BouncerWristbandsExercise, 18, "adult");
    },

    expectations(exercise) {
      const ex = exercise as BouncerWristbandsExercise;
      return [
        {
          pass: ex.wristband === "adult",
          errorHtml: `The person is 18. They should get an adult wristband (18 is not under 18), but got: ${ex.wristband ?? "none"}.`
        }
      ];
    }
  },
  {
    slug: "boundary-65",
    name: "Age 65 (senior)",
    description: "Exactly 65. They're a senior, not an adult.",
    taskId: "assign-wristband",

    setup(exercise) {
      setupScenario(exercise as BouncerWristbandsExercise, 65, "senior");
    },

    expectations(exercise) {
      const ex = exercise as BouncerWristbandsExercise;
      return [
        {
          pass: ex.wristband === "senior",
          errorHtml: `The person is 65. They should get a senior wristband (65 is not under 65), but got: ${ex.wristband ?? "none"}.`
        }
      ];
    }
  }
];
