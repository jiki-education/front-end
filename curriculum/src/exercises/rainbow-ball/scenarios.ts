import type { Task, VisualScenario } from "../types";
import { hslToHexString } from "../../exercise-categories/draw/DrawExercise";
import type { RainbowBallExercise } from "./Exercise";

// Sample the hue along its sweep to confirm the trail climbs through the spectrum, then
// require the two values nearest the top to appear twice each to confirm the hue reaches
// the maximum and bounces back down. A hue moving by 1 can only repeat a value if it
// changes direction. We avoid hue 0/360 themselves because they are both pure red and
// share a hex, so they can't tell the top of the sweep apart from the bottom.
const HUE_CHECKS: { hue: number; times: number }[] = [
  { hue: 99, times: 1 },
  { hue: 153, times: 1 },
  { hue: 206, times: 1 },
  { hue: 253, times: 1 },
  { hue: 356, times: 2 },
  { hue: 359, times: 2 }
];

export const tasks = [
  {
    id: "rainbow-ball" as const,
    name: "Create a bouncing rainbow ball",
    description:
      "Create a ball that bounces around the canvas, leaving a trail of colorful circles that cycle through rainbow colors.",
    hints: [],
    requiredScenarios: ["rainbow-ball"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "rainbow-ball",
    name: "Rainbow ball",
    description: "A bouncing ball that leaves a rainbow trail of different circles.",
    taskId: "rainbow-ball",
    randomSeed: true,
    expectations(exercise) {
      const ex = exercise as RainbowBallExercise;

      return [
        {
          pass: ex.checkUniqueColoredCircles(50),
          errorHtml: "Expected at least 50 uniquely colored circles."
        },
        {
          pass: ex.checkUniquePositionedCircles(30),
          errorHtml: "Expected at least 30 different positions."
        },
        ...HUE_CHECKS.map(({ hue, times }) => ({
          pass: ex.countCirclesWithFillColor(hslToHexString(hue, 80, 50)) >= times,
          errorHtml:
            times > 1
              ? `Expected the hue to pass through ${hue} at least ${times} times (climbing, then bouncing back down).`
              : `Expected the hue to pass through ${hue} as it sweeps through the spectrum.`
        }))
      ];
    }
  }
];
