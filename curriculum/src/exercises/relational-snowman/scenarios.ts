import type { IsolatedCheck, Task, VisualScenario } from "../types";
import type { RelationalSnowmanExercise } from "./Exercise";

export const tasks = [
  {
    id: "build-relational-snowman" as const,
    name: "Build the relational snowman",
    description: "Derive all sizes and positions from `size` so the snowman scales correctly.",
    hints: [],
    requiredScenarios: ["build-relational-snowman"],
    bonus: false
  }
] as const satisfies readonly Task[];

function expectedAt(size: number, snowmanX = 50) {
  const headRadius = size * 2;
  const bodyRadius = size * 3;
  const baseRadius = size * 4;
  const baseY = 100 - size - baseRadius;
  const bodyY = baseY - baseRadius - bodyRadius;
  const headY = bodyY - bodyRadius - headRadius;
  return {
    base: [snowmanX, baseY, baseRadius] as const,
    body: [snowmanX, bodyY, bodyRadius] as const,
    head: [snowmanX, headY, headRadius] as const
  };
}

// Per-shape feedback at the stub's default `size` value. Each circle gets its own
// message so the student gets specific guidance about which derivation is wrong.
function detailedCheck(size: number): IsolatedCheck {
  const e = expectedAt(size);
  return {
    secretConstants: { size, snowmanX: 50 },
    expectations(exercise) {
      const ex = exercise as RelationalSnowmanExercise;
      return [
        {
          pass: ex.hasCircleAt(...e.base),
          errorHtml:
            "The base (bottom) circle is either in the wrong place or the wrong size. Check `baseRadius` and `baseY`."
        },
        {
          pass: ex.hasCircleAt(...e.body),
          errorHtml:
            "The body (middle) circle is either in the wrong place or the wrong size. Check `bodyRadius` and `bodyY`."
        },
        {
          pass: ex.hasCircleAt(...e.head),
          errorHtml:
            "The head (top) circle is either in the wrong place or the wrong size. Check `headRadius` and `headY`."
        }
      ];
    }
  };
}

// Responsiveness check (size != stub default). One consolidated expect.
function responsivenessCheck(size: number): IsolatedCheck {
  const e = expectedAt(size);
  return {
    secretConstants: { size, snowmanX: 50 },
    expectations(exercise) {
      const ex = exercise as RelationalSnowmanExercise;
      const allMatch = ex.hasCircleAt(...e.base) && ex.hasCircleAt(...e.body) && ex.hasCircleAt(...e.head);
      return [
        {
          pass: allMatch,
          errorHtml: allMatch
            ? undefined
            : `Your code doesn't scale correctly when \`size\` is ${size}. Every radius and y position should be derived from \`size\`.`
        }
      ];
    }
  };
}

export const scenarios: VisualScenario[] = [
  {
    slug: "build-relational-snowman",
    name: "Build the relational snowman",
    description: "Derive every radius and y position from `size`.",
    taskId: "build-relational-snowman",

    setup(exercise) {
      const ex = exercise as RelationalSnowmanExercise;
      ex.setupBackground("/static/images/exercise-assets/relational-snowman/background.webp");
    },

    // No primary expectations — the canvas the student sees uses their own `size`
    // value and shouldn't be pinned to a specific one. Correctness is owned by the
    // isolated checks below, which re-run the code with `secretConstants` injected.
    expectations() {
      return [];
    },

    isolatedChecks: [detailedCheck(4), responsivenessCheck(1), responsivenessCheck(5)]
  }
];
