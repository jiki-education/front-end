import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "rectangle",
    signature: "rectangle(left, top, width, height, color)",
    description: "functions.rectangle.description",
    examples: [
      'rectangle(0, 0, 100, 100, "black")',
      "rectangle(squareX, squareY, squareSize, squareSize, squareColor)"
    ],
    category: "functions.rectangle.category"
  },
  {
    name: "circle",
    signature: "circle(centerX, centerY, radius, color)",
    description: "functions.circle.description",
    examples: [
      'circle(centerX, centerY, squareSize * 0.4, "black")',
      'circle(centerX, centerY, squareSize * 0.3, "charcoal")'
    ],
    category: "functions.circle.category"
  },
  {
    name: "getBoardSize",
    signature: "getBoardSize()",
    description: "functions.getBoardSize.description",
    examples: ["let boardSize = getBoardSize()"],
    category: "functions.getBoardSize.category"
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
