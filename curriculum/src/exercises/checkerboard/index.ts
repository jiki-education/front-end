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
      'rectangle(2, 2, 12, 12, "white")',
      "rectangle(margin + col * cell, margin + row * cell, cell, cell, squareColor)"
    ],
    category: "Drawing Shapes"
  },
  {
    name: "circle",
    signature: "circle(centerX, centerY, radius, color)",
    description: "Draw a circle centered at (centerX, centerY) with the given radius and color",
    examples: [
      'circle(20, 8, 5, "red")',
      "circle(margin + col * cell + cell / 2, margin + row * cell + cell / 2, cell / 2 - 1, color)"
    ],
    category: "Drawing Shapes"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["modulo", "nested-loops", "if", "else"]
};

export default exerciseDefinition;
