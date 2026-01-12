import type { Task, VisualScenario } from "../types";
import type { PenguinExercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-penguin" as const,
    name: "Draw the symmetrical penguin",
    description: "Complete the penguin drawing by adding the missing parts to make it symmetrical.",
    hints: [],
    requiredScenarios: ["make-penguin-symmetrical"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "make-penguin-symmetrical",
    name: "Make the penguin symmetrical",
    description: "Fix all the TODO comments to make the penguin symmetrical.",
    taskId: "draw-penguin",

    expectations(exercise) {
      const ex = exercise as PenguinExercise;

      return [
        {
          pass: ex.hasRectangleAt(0, 0, 100, 100),
          errorHtml: "The sky has gone wrong."
        },
        {
          pass: ex.hasRectangleAt(0, 70, 100, 30),
          errorHtml: "The ground has gone wrong."
        },
        {
          pass: ex.hasEllipseAt(28, 55, 10, 25),
          errorHtml: "The left wing doesn't seem right."
        },
        {
          pass: ex.hasEllipseAt(72, 55, 10, 25),
          errorHtml: "The right wing doesn't seem right."
        },
        {
          pass: ex.hasEllipseAt(50, 53, 25, 40),
          errorHtml: "The outer body has gone wrong."
        },
        {
          pass: ex.hasEllipseAt(50, 50, 21, 39),
          errorHtml: "The inner body has gone wrong."
        },
        {
          pass: ex.hasCircleAt(50, 31, 23),
          errorHtml: "The head has gone wrong."
        },
        {
          pass: ex.hasEllipseAt(41, 32, 11, 14),
          errorHtml: "The left side of the face doesn't look right."
        },
        {
          pass: ex.hasEllipseAt(59, 32, 11, 14),
          errorHtml: "The right side of the face doesn't look right."
        },
        {
          pass: ex.hasEllipseAt(50, 40, 16, 11),
          errorHtml: "The lower part of the face doesn't look right."
        },
        {
          pass: ex.hasCircleAt(42, 33, 3),
          errorHtml: "The left eye seems off."
        },
        {
          pass: ex.hasCircleAt(43, 34, 1),
          errorHtml: "The left iris seems off."
        },
        {
          pass: ex.hasCircleAt(58, 33, 3),
          errorHtml: "The right eye seems off."
        },
        {
          pass: ex.hasCircleAt(57, 34, 1),
          errorHtml: "The right iris seems off."
        },
        {
          pass: ex.hasEllipseAt(40, 93, 7, 4),
          errorHtml: "The left foot's gone astray."
        },
        {
          pass: ex.hasEllipseAt(60, 93, 7, 4),
          errorHtml: "The right foot's not right."
        },
        {
          pass: ex.hasTriangleAt(46, 38, 54, 38, 50, 47),
          errorHtml: "The nose isn't right."
        }
      ];
    }
  }
];
