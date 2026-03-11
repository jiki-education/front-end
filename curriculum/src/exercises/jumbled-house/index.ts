import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "rectangle",
    signature: "rectangle(x, y, width, height, color)",
    description: "Draw a rectangle at position (x, y) with the given width, height, and color",
    examples: ['rectangle(0, 0, 100, 50, "skyblue")', 'rectangle(20, 50, 60, 40, "brown")'],
    category: "Drawing Shapes"
  },
  {
    name: "circle",
    signature: "circle(centerX, centerY, radius, color)",
    description: "Draw a circle centered at (centerX, centerY) with the given radius and color",
    examples: ['circle(50, 50, 10, "black")', 'circle(55, 81, 1, "yellow")'],
    category: "Drawing Shapes"
  },
  {
    name: "triangle",
    signature: "triangle(x1, y1, x2, y2, x3, y3, color)",
    description: "Draw a triangle with three corner points and a color",
    examples: ['triangle(16, 50, 50, 30, 84, 50, "brick")'],
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
  conceptSlugs: ["using-functions", "function-inputs", "strings"]
};

export default exerciseDefinition;
