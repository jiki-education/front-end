import type { IsolatedCheck, Task, VisualScenario } from "../types";
import type { RelationalTrafficLightsExercise } from "./Exercise";

export const tasks = [
  {
    id: "build-relational-traffic-lights" as const,
    name: "Build the relational traffic lights",
    description: "Derive every position and size from `center` and `radius` so the traffic light scales correctly.",
    hints: [],
    requiredScenarios: ["build-relational-traffic-lights"],
    bonus: false
  }
] as const satisfies readonly Task[];

function expectedAt(radius: number, center = 50) {
  return {
    housing: [center - radius * 2, center - radius * 4, radius * 4, radius * 8] as const,
    red: [center, center - radius * 2, radius] as const,
    yellow: [center, center, radius] as const,
    green: [center, center + radius * 2, radius] as const
  };
}

// Per-shape feedback (radius=10 — the stub's default). Each shape gets its own message
// so the student gets specific guidance about which derivation is wrong.
function detailedCheck(radius: number): IsolatedCheck {
  const e = expectedAt(radius);
  return {
    secretConstants: { radius },
    expectations(exercise) {
      const ex = exercise as RelationalTrafficLightsExercise;
      return [
        {
          pass: ex.hasRectangleAt(...e.housing),
          errorHtml:
            "The housing rectangle is either in the wrong place or the wrong size. Check `housingX`, `housingY`, `housingWidth`, and `housingHeight`."
        },
        {
          pass: ex.hasCircleAt(...e.red),
          errorHtml: "The red light is either in the wrong place or the wrong size. Check `redY`."
        },
        {
          pass: ex.hasCircleAt(...e.yellow),
          errorHtml: "The yellow light is either in the wrong place or the wrong size. Check `yellowY`."
        },
        {
          pass: ex.hasCircleAt(...e.green),
          errorHtml: "The green light is either in the wrong place or the wrong size. Check `greenY`."
        }
      ];
    }
  };
}

// Responsiveness check (radius != 10). One consolidated expect: either everything lines
// up or the scenario fails with a "doesn't scale" message.
function responsivenessCheck(radius: number): IsolatedCheck {
  const e = expectedAt(radius);
  return {
    secretConstants: { radius },
    expectations(exercise) {
      const ex = exercise as RelationalTrafficLightsExercise;
      const allMatch =
        ex.hasRectangleAt(...e.housing) &&
        ex.hasCircleAt(...e.red) &&
        ex.hasCircleAt(...e.yellow) &&
        ex.hasCircleAt(...e.green);
      return [
        {
          pass: allMatch,
          errorHtml: allMatch
            ? undefined
            : `Your code doesn't scale correctly when \`radius\` is ${radius}. Every position and size should be derived from \`center\` and \`radius\`.`
        }
      ];
    }
  };
}

export const scenarios: VisualScenario[] = [
  {
    slug: "build-relational-traffic-lights",
    name: "Build the relational traffic lights",
    description: "Derive every position and size from `center` and `radius`.",
    taskId: "build-relational-traffic-lights",

    // No primary expectations — the canvas the student sees uses their own `radius`
    // value and shouldn't be pinned to a specific one. Correctness is owned by the
    // isolated checks below, which re-run the code with `secretConstants` injected.
    expectations() {
      return [];
    },

    isolatedChecks: [detailedCheck(10), responsivenessCheck(5), responsivenessCheck(15)]
  }
];
