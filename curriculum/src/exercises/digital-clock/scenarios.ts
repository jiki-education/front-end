import type { Task, VisualScenario } from "../types";
import type DigitalClockExercise from "./Exercise";

export const tasks = [
  {
    id: "display-time" as const,
    name: "tasks.displayTime.name",
    description: "tasks.displayTime.description",
    hints: [],
    requiredScenarios: ["morning-1", "morning-2", "afternoon-1", "afternoon-2", "midnight", "noon", "now"],
    bonus: false
  }
] as const satisfies readonly Task[];

function computeExpectedTime(hour: number, minute: number): string {
  const indicator = hour >= 12 ? "pm" : "am";
  let displayHour = hour;
  if (hour === 0) {
    displayHour = 12;
  } else if (hour > 12) {
    displayHour = hour - 12;
  }
  return `${displayHour}:${String(minute).padStart(2, "0")}${indicator}`;
}

export const scenarios: VisualScenario[] = [
  {
    slug: "morning-1",
    name: "scenarios.morning1.name",
    description: "scenarios.morning1.description",
    taskId: "display-time",

    setup(exercise) {
      const ex = exercise as DigitalClockExercise;
      ex.setTime(6, 35);
    },

    expectations(exercise) {
      const ex = exercise as DigitalClockExercise;
      return [
        {
          pass: ex.displayedTime !== undefined,
          errorHtml: exercise.t("checks.notUpdated")
        },
        {
          pass: ex.displayedTime === "6:35am",
          errorHtml: exercise.t("checks.wrongTime", { expected: "6:35am", got: ex.displayedTime })
        }
      ];
    }
  },
  {
    slug: "morning-2",
    name: "scenarios.morning2.name",
    description: "scenarios.morning2.description",
    taskId: "display-time",

    setup(exercise) {
      const ex = exercise as DigitalClockExercise;
      ex.setTime(11, 4);
    },

    expectations(exercise) {
      const ex = exercise as DigitalClockExercise;
      return [
        {
          pass: ex.displayedTime !== undefined,
          errorHtml: exercise.t("checks.notUpdated")
        },
        {
          pass: ex.displayedTime === "11:04am",
          errorHtml: exercise.t("checks.wrongTime", { expected: "11:04am", got: ex.displayedTime })
        }
      ];
    }
  },
  {
    slug: "afternoon-1",
    name: "scenarios.afternoon1.name",
    description: "scenarios.afternoon1.description",
    taskId: "display-time",

    setup(exercise) {
      const ex = exercise as DigitalClockExercise;
      ex.setTime(12, 19);
    },

    expectations(exercise) {
      const ex = exercise as DigitalClockExercise;
      return [
        {
          pass: ex.displayedTime !== undefined,
          errorHtml: exercise.t("checks.notUpdated")
        },
        {
          pass: ex.displayedTime === "12:19pm",
          errorHtml: exercise.t("checks.wrongTime", { expected: "12:19pm", got: ex.displayedTime })
        }
      ];
    }
  },
  {
    slug: "afternoon-2",
    name: "scenarios.afternoon2.name",
    description: "scenarios.afternoon2.description",
    taskId: "display-time",

    setup(exercise) {
      const ex = exercise as DigitalClockExercise;
      ex.setTime(23, 32);
    },

    expectations(exercise) {
      const ex = exercise as DigitalClockExercise;
      return [
        {
          pass: ex.displayedTime !== undefined,
          errorHtml: exercise.t("checks.notUpdated")
        },
        {
          pass: ex.displayedTime === "11:32pm",
          errorHtml: exercise.t("checks.wrongTime", { expected: "11:32pm", got: ex.displayedTime })
        }
      ];
    }
  },
  {
    slug: "midnight",
    name: "scenarios.midnight.name",
    description: "scenarios.midnight.description",
    taskId: "display-time",

    setup(exercise) {
      const ex = exercise as DigitalClockExercise;
      ex.setTime(0, 0);
    },

    expectations(exercise) {
      const ex = exercise as DigitalClockExercise;
      return [
        {
          pass: ex.displayedTime !== undefined,
          errorHtml: exercise.t("checks.notUpdated")
        },
        {
          pass: ex.displayedTime === "12:00am",
          errorHtml: exercise.t("checks.wrongTime", { expected: "12:00am", got: ex.displayedTime })
        }
      ];
    }
  },
  {
    slug: "noon",
    name: "scenarios.noon.name",
    description: "scenarios.noon.description",
    taskId: "display-time",

    setup(exercise) {
      const ex = exercise as DigitalClockExercise;
      ex.setTime(12, 0);
    },

    expectations(exercise) {
      const ex = exercise as DigitalClockExercise;
      return [
        {
          pass: ex.displayedTime !== undefined,
          errorHtml: exercise.t("checks.notUpdated")
        },
        {
          pass: ex.displayedTime === "12:00pm",
          errorHtml: exercise.t("checks.wrongTime", { expected: "12:00pm", got: ex.displayedTime })
        }
      ];
    }
  },
  {
    slug: "now",
    name: "scenarios.now.name",
    description: "scenarios.now.description",
    taskId: "display-time",

    setup(exercise) {
      const ex = exercise as DigitalClockExercise;
      const now = new Date();
      ex.setTime(now.getHours(), now.getMinutes());
    },

    expectations(exercise) {
      const ex = exercise as DigitalClockExercise;
      // Recompute from Date - safe because test execution is synchronous
      const now = new Date();
      const expectedTime = computeExpectedTime(now.getHours(), now.getMinutes());
      return [
        {
          pass: ex.displayedTime !== undefined,
          errorHtml: exercise.t("checks.notUpdated")
        },
        {
          pass: ex.displayedTime === expectedTime,
          errorHtml: exercise.t("checks.wrongTime", { expected: expectedTime, got: ex.displayedTime })
        }
      ];
    }
  }
];
