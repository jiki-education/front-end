import type { Task, VisualScenario } from "../types";
import type { StripeyFabricExercise } from "./Exercise";

export const tasks = [
  {
    id: "weave-the-fabric" as const,
    name: "tasks.weaveTheFabric.name",
    description: "tasks.weaveTheFabric.description",
    hints: [],
    requiredScenarios: ["weave-the-fabric"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "weave-the-fabric",
    name: "scenarios.weaveTheFabric.name",
    description: "scenarios.weaveTheFabric.description",
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
          errorHtml: ex.t("checks.stripe1Purple")
        },
        {
          pass: ex.hasRectangleAtWithColor(5, 0, 5, 100, "blue"),
          errorHtml: ex.t("checks.stripe2Blue")
        },
        {
          pass: ex.hasRectangleAtWithColor(10, 0, 5, 100, "yellow"),
          errorHtml: ex.t("checks.stripe3Yellow")
        },
        {
          pass: ex.hasRectangleAtWithColor(15, 0, 5, 100, "green"),
          errorHtml: ex.t("checks.stripe4Green")
        },
        {
          pass: ex.hasRectangleAtWithColor(20, 0, 5, 100, "yellow"),
          errorHtml: ex.t("checks.stripe5Yellow")
        },
        {
          pass: ex.hasRectangleAtWithColor(25, 0, 5, 100, "blue"),
          errorHtml: ex.t("checks.stripe6Blue")
        },
        {
          pass: ex.hasRectangleAtWithColor(35, 0, 5, 100, "green"),
          errorHtml: ex.t("checks.stripe8Green")
        },
        {
          pass: ex.hasRectangleAtWithColor(55, 0, 5, 100, "green"),
          errorHtml: ex.t("checks.stripe12Green")
        },
        {
          pass: ex.hasRectangleAtWithColor(90, 0, 5, 100, "yellow"),
          errorHtml: ex.t("checks.stripe19Yellow")
        },
        {
          pass: ex.hasRectangleAtWithColor(95, 0, 5, 100, "purple"),
          errorHtml: ex.t("checks.stripe20Purple")
        }
      ];
    },

    codeChecks: [
      {
        pass: (result) => result.assertors.numFunctionCallsInCode("rectangle") === 1,
        errorKey: "checks.rectangleOnce"
      }
    ]
  }
];
