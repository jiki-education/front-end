import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "rectangle",
    signature: "rectangle(left, top, width, height, color)",
    description: "Draw a rectangle at position (left, top) with the given width, height, and color",
    examples: [
      'rectangle(0, 0, 100, 100, "black")',
      "rectangle(squareX, squareY, squareSize, squareSize, squareColor)"
    ],
    category: "Drawing Shapes"
  },
  {
    name: "circle",
    signature: "circle(centerX, centerY, radius, color)",
    description: "Draw a circle centered at (centerX, centerY) with the given radius and color",
    examples: [
      'circle(centerX, centerY, squareSize * 0.4, "black")',
      'circle(centerX, centerY, squareSize * 0.3, "charcoal")'
    ],
    category: "Drawing Shapes"
  },
  {
    name: "getBoardSize",
    signature: "getBoardSize()",
    description: "Returns the size of the board (the number of squares along each edge) for the current puzzle",
    examples: ["let boardSize = getBoardSize()"],
    category: "Information"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: [
    "modulo",
    "nested-loops",
    "if",
    "else",
    "else-if",
    "updating-variables",
    "using-functions-with-return-values"
  ],
  interpreterOptions: { maxTotalLoopIterations: 300 }
};

export default exerciseDefinition;
