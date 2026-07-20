import type { IsolatedCheck, Task, VisualScenario } from "../types";
import type { RelationalSunExercise } from "./Exercise";

export const tasks = [
  {
    id: "position-sun" as const,
    name: "tasks.positionSun.name",
    description: "tasks.positionSun.description",
    hints: [],
    requiredScenarios: ["position-sun"],
    bonus: false
  }
] as const satisfies readonly Task[];

function expectedAt(gap: number, radius: number, canvasSize = 100) {
  return {
    sun: [canvasSize - gap - radius, gap + radius, radius] as const
  };
}

// Per-shape feedback at the stub's default gap/radius values.
function detailedCheck(gap: number, radius: number): IsolatedCheck {
  const e = expectedAt(gap, radius);
  return {
    secretConstants: { gap, radius },
    expectations(exercise) {
      const ex = exercise as RelationalSunExercise;
      return [
        {
          pass: ex.hasCircleAt(...e.sun),
          errorHtml: ex.t("checks.wrongPosition")
        }
      ];
    }
  };
}

// Responsiveness check (gap/radius != stub defaults).
function responsivenessCheck(gap: number, radius: number): IsolatedCheck {
  const e = expectedAt(gap, radius);
  return {
    secretConstants: { gap, radius },
    expectations(exercise) {
      const ex = exercise as RelationalSunExercise;
      const pass = ex.hasCircleAt(...e.sun);
      return [
        {
          pass,
          errorHtml: pass ? undefined : ex.t("checks.notResponsive", { gap, radius })
        }
      ];
    }
  };
}

export const scenarios: VisualScenario[] = [
  {
    slug: "position-sun",
    name: "scenarios.positionSun.name",
    description: "scenarios.positionSun.description",
    taskId: "position-sun",

    setup(exercise) {
      const ex = exercise as RelationalSunExercise;
      ex.setupBackground("/static/images/exercise-assets/relational-sun/background.webp");
    },

    // No primary expectations — the canvas reflects the student's own gap/radius
    // values. Correctness is owned by the isolated checks below.
    expectations() {
      return [];
    },

    isolatedChecks: [detailedCheck(10, 15), responsivenessCheck(5, 10), responsivenessCheck(15, 20)]
  }
];
