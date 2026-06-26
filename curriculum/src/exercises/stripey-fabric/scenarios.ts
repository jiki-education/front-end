import type { Task, VisualScenario } from "../types";
import type { StripeyFabricExercise } from "./Exercise";

export const tasks = [
  {
    id: "weave-the-fabric" as const,
    name: "Weave the fabric",
    description:
      "Draw 20 vertical stripes. The two end stripes are purple; otherwise multiples of 4 are green, other even stripes are blue, and odd stripes are yellow.",
    hints: [],
    requiredScenarios: ["weave-the-fabric"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "weave-the-fabric",
    name: "Weave the stripey fabric",
    description: "Draw all 20 stripes with the correct colours.",
    taskId: "weave-the-fabric",

    setup(exercise) {
      const ex = exercise as StripeyFabricExercise;
      ex.setDrawDelayMs(20);
    },

    expectations(exercise) {
      const ex = exercise as StripeyFabricExercise;

      // Each stripe i is 5 wide and 100 tall, with its left edge at (i - 1) * 5.
      return [
        {
          pass: ex.hasRectangleAtWithColor(0, 0, 5, 100, "purple"),
          errorHtml: "Stripe 1 is an end stripe, so it should be purple."
        },
        {
          pass: ex.hasRectangleAtWithColor(5, 0, 5, 100, "blue"),
          errorHtml: "Stripe 2 should be blue (it's even, but not a multiple of 4)."
        },
        {
          pass: ex.hasRectangleAtWithColor(10, 0, 5, 100, "yellow"),
          errorHtml: "Stripe 3 should be yellow (it's odd, and not an end stripe)."
        },
        {
          pass: ex.hasRectangleAtWithColor(15, 0, 5, 100, "green"),
          errorHtml:
            "Stripe 4 should be green. It's a multiple of 4, so check the multiple-of-4 rule before the even rule."
        },
        {
          pass: ex.hasRectangleAtWithColor(20, 0, 5, 100, "yellow"),
          errorHtml: "Stripe 5 should be yellow (it's odd, and not an end stripe)."
        },
        {
          pass: ex.hasRectangleAtWithColor(25, 0, 5, 100, "blue"),
          errorHtml: "Stripe 6 should be blue (it's even, but not a multiple of 4)."
        },
        {
          pass: ex.hasRectangleAtWithColor(35, 0, 5, 100, "green"),
          errorHtml: "Stripe 8 should be green (it's a multiple of 4)."
        },
        {
          pass: ex.hasRectangleAtWithColor(55, 0, 5, 100, "green"),
          errorHtml: "Stripe 12 should be green (it's a multiple of 4)."
        },
        {
          pass: ex.hasRectangleAtWithColor(90, 0, 5, 100, "yellow"),
          errorHtml: "Stripe 19 should be yellow (it's odd, and not an end stripe)."
        },
        {
          pass: ex.hasRectangleAtWithColor(95, 0, 5, 100, "purple"),
          errorHtml: "Stripe 20 is an end stripe, so it should be purple (even though it's even)."
        }
      ];
    },

    codeChecks: [
      {
        pass: (result) => result.assertors.numFunctionCallsInCode("rectangle") === 1,
        errorHtml:
          "You're using the <code>rectangle</code> function in more than one place. It should only appear once, inside a loop - don't write out all 20 stripes by hand!"
      }
    ]
  }
];
