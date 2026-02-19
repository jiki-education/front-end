import type { Task, VisualScenario } from "../types";
import type DigitalClockExercise from "./Exercise";

export const tasks = [
  {
    id: "display-time" as const,
    name: "Display the time on the clock",
    description:
      "Get the current hour and minute, convert to 12-hour format with am/pm, and display it using displayTime().",
    hints: [
      "Use currentTimeHour() and currentTimeMinute() to get the time",
      "If the hour is >= 12, the indicator is 'pm', otherwise 'am'",
      "If the hour is 0 (midnight), display it as 12",
      "If the hour is > 12, subtract 12 to get the 12-hour format"
    ],
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
  return `${displayHour}:${minute}${indicator}`;
}

export const scenarios: VisualScenario[] = [
  {
    slug: "morning-1",
    name: "Early morning",
    description: 'Display 6:35 as "6:35am"',
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
          errorHtml: "The clock didn't get updated. Make sure you use the <code>displayTime</code> function."
        },
        {
          pass: ex.displayedTime === "6:35am",
          errorHtml: `Expected "6:35am" but got "${ex.displayedTime}"`
        }
      ];
    }
  },
  {
    slug: "morning-2",
    name: "Late morning",
    description: 'Display 11:04 as "11:4am"',
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
          errorHtml: "The clock didn't get updated. Make sure you use the <code>displayTime</code> function."
        },
        {
          pass: ex.displayedTime === "11:4am",
          errorHtml: `Expected "11:4am" but got "${ex.displayedTime}"`
        }
      ];
    }
  },
  {
    slug: "afternoon-1",
    name: "Early afternoon",
    description: 'Display 12:19 as "12:19pm"',
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
          errorHtml: "The clock didn't get updated. Make sure you use the <code>displayTime</code> function."
        },
        {
          pass: ex.displayedTime === "12:19pm",
          errorHtml: `Expected "12:19pm" but got "${ex.displayedTime}"`
        }
      ];
    }
  },
  {
    slug: "afternoon-2",
    name: "Late evening",
    description: 'Display 23:32 as "11:32pm"',
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
          errorHtml: "The clock didn't get updated. Make sure you use the <code>displayTime</code> function."
        },
        {
          pass: ex.displayedTime === "11:32pm",
          errorHtml: `Expected "11:32pm" but got "${ex.displayedTime}"`
        }
      ];
    }
  },
  {
    slug: "midnight",
    name: "Midnight",
    description: 'Display midnight as "12:0am"',
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
          errorHtml: "The clock didn't get updated. Make sure you use the <code>displayTime</code> function."
        },
        {
          pass: ex.displayedTime === "12:0am",
          errorHtml: `Expected "12:0am" but got "${ex.displayedTime}"`
        }
      ];
    }
  },
  {
    slug: "noon",
    name: "Noon",
    description: 'Display noon as "12:0pm"',
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
          errorHtml: "The clock didn't get updated. Make sure you use the <code>displayTime</code> function."
        },
        {
          pass: ex.displayedTime === "12:0pm",
          errorHtml: `Expected "12:0pm" but got "${ex.displayedTime}"`
        }
      ];
    }
  },
  {
    slug: "now",
    name: "Display the current time",
    description: "Display the current time",
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
          errorHtml: "The clock didn't get updated. Make sure you use the <code>displayTime</code> function."
        },
        {
          pass: ex.displayedTime === expectedTime,
          errorHtml: `Expected "${expectedTime}" but got "${ex.displayedTime}"`
        }
      ];
    }
  }
];
