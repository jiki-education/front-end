import type { IsolatedCheck, Task, VisualScenario } from "../types";
import type { StructuredHouseExercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-house" as const,
    name: "tasks.drawHouse.name",
    description: "tasks.drawHouse.description",
    hints: [],
    requiredScenarios: ["draw-the-house"],
    bonus: false
  }
] as const satisfies readonly Task[];

// The JavaScript interpreter rounds every arithmetic result to 5 decimal places, so the
// fraction-based coordinates (e.g. houseWidth / 7, houseHeight / 3) come back rounded.
// We mirror that rounding here so the expected values match the interpreter exactly.
function r(value: number): number {
  return Math.round(value * 100000) / 100000;
}

// The house is built from just two anchors: houseWidth and houseHeight. It is always
// centered horizontally and planted on the grass, and every dimension is a fraction of
// the frame's width or height (the knob is sized relative to the door). Changing the
// anchors should resize the whole house while keeping all of that true.
function expectedAt(houseWidth: number, houseHeight: number) {
  const canvasWidth = 100;
  const centerX = canvasWidth / 2;
  const houseLeft = centerX - houseWidth / 2;

  const grassHeight = 15;
  const grassTop = 100 - grassHeight;
  const houseBottom = grassTop + 5;
  const houseTop = houseBottom - houseHeight;

  const roofOverhang = houseWidth / 10;
  const roofHeight = houseHeight / 2;
  const windowWidth = houseWidth / 5;
  const windowHeight = houseHeight / 3;
  const windowInset = houseWidth / 7;
  const windowTopOffset = houseHeight / 8;
  const doorWidth = houseWidth / 5;
  const doorHeight = houseHeight / 2;
  const knobRadius = doorWidth / 10;
  const knobOffset = doorWidth / 10;

  const doorLeft = centerX - doorWidth / 2;
  const doorTop = houseBottom - doorHeight;

  return {
    frame: [r(houseLeft), r(houseTop), r(houseWidth), r(houseHeight)] as const,
    roof: [
      r(houseLeft - roofOverhang),
      r(houseTop),
      r(centerX),
      r(houseTop - roofHeight),
      r(houseLeft + houseWidth + roofOverhang),
      r(houseTop)
    ] as const,
    leftWindow: [r(houseLeft + windowInset), r(houseTop + windowTopOffset), r(windowWidth), r(windowHeight)] as const,
    rightWindow: [
      r(houseLeft + houseWidth - windowInset - windowWidth),
      r(houseTop + windowTopOffset),
      r(windowWidth),
      r(windowHeight)
    ] as const,
    door: [r(doorLeft), r(doorTop), r(doorWidth), r(doorHeight)] as const,
    knob: [r(doorLeft + doorWidth - knobRadius - knobOffset), r(doorTop + doorHeight / 2), r(knobRadius)] as const
  };
}

// Per-shape feedback at the stub's default anchor values. Each shape gets its own
// message so the student gets specific guidance about which derivation is wrong.
function detailedCheck(houseWidth: number, houseHeight: number): IsolatedCheck {
  const e = expectedAt(houseWidth, houseHeight);
  return {
    secretConstants: { houseWidth, houseHeight },
    expectations(exercise) {
      const ex = exercise as StructuredHouseExercise;
      return [
        {
          pass: ex.hasRectangleAt(...e.frame),
          errorHtml: ex.t("checks.frameWrong")
        },
        {
          pass: ex.hasTriangleAt(...e.roof),
          errorHtml: ex.t("checks.roofWrong")
        },
        {
          pass: ex.hasRectangleAt(...e.leftWindow),
          errorHtml: ex.t("checks.leftWindowWrong")
        },
        {
          pass: ex.hasRectangleAt(...e.rightWindow),
          errorHtml: ex.t("checks.rightWindowWrong")
        },
        {
          pass: ex.hasRectangleAt(...e.door),
          errorHtml: ex.t("checks.doorWrong")
        },
        {
          pass: ex.hasCircleAt(...e.knob),
          errorHtml: ex.t("checks.knobWrong")
        }
      ];
    }
  };
}

// Responsiveness check (anchors != stub defaults). One consolidated expect: either the
// whole house lines up or the scenario fails with a "doesn't scale" message.
function responsivenessCheck(houseWidth: number, houseHeight: number): IsolatedCheck {
  const e = expectedAt(houseWidth, houseHeight);
  return {
    secretConstants: { houseWidth, houseHeight },
    expectations(exercise) {
      const ex = exercise as StructuredHouseExercise;
      const allMatch =
        ex.hasRectangleAt(...e.frame) &&
        ex.hasTriangleAt(...e.roof) &&
        ex.hasRectangleAt(...e.leftWindow) &&
        ex.hasRectangleAt(...e.rightWindow) &&
        ex.hasRectangleAt(...e.door) &&
        ex.hasCircleAt(...e.knob);
      return [
        {
          pass: allMatch,
          errorHtml: allMatch ? undefined : ex.t("checks.doesNotScale", { houseWidth, houseHeight })
        }
      ];
    }
  };
}

export const scenarios: VisualScenario[] = [
  {
    slug: "draw-the-house",
    name: "scenarios.drawTheHouse.name",
    description: "scenarios.drawTheHouse.description",
    taskId: "draw-house",

    // No primary expectations — the canvas the student sees uses their own anchor
    // values and shouldn't be pinned to specific ones. Correctness is owned by the
    // isolated checks below, which re-run the code with `secretConstants` injected.
    expectations() {
      return [];
    },

    isolatedChecks: [detailedCheck(60, 40), responsivenessCheck(80, 36), responsivenessCheck(44, 58)]
  }
];
