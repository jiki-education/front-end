import type { Task, VisualScenario } from "../types";
import { hslToHexString } from "../../exercise-categories/draw/DrawExercise";
import type { RainbowBallExercise } from "./Exercise";

// The hue should sweep up to its maximum then back down to its minimum, reversing at
// each end. We detect each bounce by a colour just inside that end appearing at least
// twice: once approaching the edge, once leaving it. A hue moving by 1 can only repeat
// a value if it changes direction. We avoid hue 0/360 themselves because they are both
// pure red and share a hex, so they can't tell the top bounce apart from the bottom.
const HUE_359 = hslToHexString(359, 80, 50); // just below the maximum (360)
const HUE_1 = hslToHexString(1, 80, 50); // just above the minimum (0)

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
        {
          pass: ex.countCirclesWithFillColor(HUE_359) >= 2,
          errorHtml: "Expected the hue to reach the top of the range and bounce back down."
        },
        {
          pass: ex.countCirclesWithFillColor(HUE_1) >= 2,
          errorHtml: "Expected the hue to reach the bottom of the range and bounce back up."
        }
      ];
    }
  }
];
