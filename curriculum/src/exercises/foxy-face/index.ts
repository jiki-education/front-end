import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "rectangle",
    signature: "rectangle(left, top, width, height, color)",
    description: "Draw a rectangle at position (left, top) with the given width, height, and color",
    examples: ['rectangle(0, 0, 100, 100, "grey")'],
    category: "Drawing Shapes"
  },
  {
    name: "triangle",
    signature: "triangle(x1, y1, x2, y2, x3, y3, color)",
    description: "Draw a triangle with three corner points and a color",
    examples: ['triangle(10, 40, 10, 5, 50, 40, "brown")'],
    category: "Drawing Shapes"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions
};

export default exerciseDefinition;
