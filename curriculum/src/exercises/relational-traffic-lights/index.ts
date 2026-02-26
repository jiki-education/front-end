import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "rectangle",
    signature: "rectangle(left, top, width, height, color)",
    description: "Draw a rectangle at position (left, top) with the given width, height, and color",
    examples: ['rectangle(30, 10, 40, 80, "charcoal")'],
    category: "Drawing Shapes"
  },
  {
    name: "circle",
    signature: "circle(x, y, radius, color)",
    description: "Draw a circle centered at (x, y) with the given radius and color",
    examples: ['circle(50, 30, 10, "red")'],
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
