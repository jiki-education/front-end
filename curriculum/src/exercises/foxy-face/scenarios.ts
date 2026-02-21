import type { Task, VisualScenario } from "../types";
import type { FoxyFaceExercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-fox" as const,
    name: "Draw the fox face",
    description: "Use triangles to build a geometric fox face on the grey background.",
    hints: [
      "Draw 8 triangles total",
      "The cheeks are white (white)",
      "The ears are dark orange (brown), the face is lighter orange (orange)",
      "The nose uses two dark triangles (charcoal)"
    ],
    requiredScenarios: ["draw-fox"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "draw-fox",
    name: "Draw the fox face",
    description: "Build a geometric fox face using triangles.",
    taskId: "draw-fox",

    expectations(exercise) {
      const ex = exercise as FoxyFaceExercise;

      return [
        {
          pass: ex.hasRectangleAt(0, 0, 100, 100),
          errorHtml: "The grey background rectangle is missing."
        },
        {
          pass: ex.hasTriangleAt(10, 40, 5, 60, 50, 95),
          errorHtml: "The left cheek triangle isn't right. It should have corners at (10,40), (5,60), and (50,95)."
        },
        {
          pass: ex.hasTriangleAt(90, 40, 95, 60, 50, 95),
          errorHtml: "The right cheek triangle isn't right. It should have corners at (90,40), (95,60), and (50,95)."
        },
        {
          pass: ex.hasTriangleAt(10, 40, 10, 5, 50, 40),
          errorHtml: "The left ear triangle isn't right. It should have corners at (10,40), (10,5), and (50,40)."
        },
        {
          pass: ex.hasTriangleAt(90, 40, 90, 5, 50, 40),
          errorHtml: "The right ear triangle isn't right. It should have corners at (90,40), (90,5), and (50,40)."
        },
        {
          pass: ex.hasTriangleAt(50, 30, 50, 95, 10, 40),
          errorHtml: "The left face triangle isn't right. It should have corners at (50,30), (50,95), and (10,40)."
        },
        {
          pass: ex.hasTriangleAt(50, 30, 50, 95, 90, 40),
          errorHtml: "The right face triangle isn't right. It should have corners at (50,30), (50,95), and (90,40)."
        },
        {
          pass: ex.hasTriangleAt(40, 90, 50, 85, 60, 90),
          errorHtml: "The top nose triangle isn't right. It should have corners at (40,90), (50,85), and (60,90)."
        },
        {
          pass: ex.hasTriangleAt(50, 95, 40, 90, 60, 90),
          errorHtml: "The bottom nose triangle isn't right. It should have corners at (50,95), (40,90), and (60,90)."
        }
      ];
    }
  }
];
