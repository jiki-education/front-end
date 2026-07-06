import type { Task, VisualScenario } from "../types";
import { hslToHexString } from "../../exercise-categories/draw/DrawExercise";
import type { RainbowBallExercise } from "./Exercise";

// The hue climbs to its maximum (360) then reverses. We detect the bounce by the
// colours either side of the peak: hue 360 must be reached, and hue 359 must appear
// at least twice (once on the way up, once on the way back down).
const HUE_360 = hslToHexString(360, 80, 50);
const HUE_359 = hslToHexString(359, 80, 50);

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
          pass: ex.countCirclesWithFillColor(HUE_360) >= 1,
          errorHtml: "Expected the hue to climb all the way to its maximum (360)."
        },
        {
          pass: ex.countCirclesWithFillColor(HUE_359) >= 2,
          errorHtml: "Expected the hue to bounce back down once it reached the maximum."
        }
      ];
    }
  }
];
