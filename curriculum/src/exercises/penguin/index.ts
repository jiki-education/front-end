import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "rectangle",
    signature: "rectangle(x, y, width, height, color)",
    description: "Draw a rectangle at position (x, y) with the given width, height, and color",
    examples: ['rectangle(0, 0, 100, 50, "skyblue")', 'rectangle(10, 20, 50, 30, "black")'],
    category: "Drawing Shapes"
  },
  {
    name: "circle",
    signature: "circle(centerX, centerY, radius, color)",
    description: "Draw a circle centered at (centerX, centerY) with the given radius and color",
    examples: ['circle(50, 50, 10, "black")', 'circle(25, 75, 15, "white")'],
    category: "Drawing Shapes"
  },
  {
    name: "ellipse",
    signature: "ellipse(centerX, centerY, radiusX, radiusY, color)",
    description: "Draw an ellipse centered at (centerX, centerY) with horizontal and vertical radii and color",
    examples: ['ellipse(50, 50, 20, 10, "black")', 'ellipse(30, 60, 15, 5, "white")'],
    category: "Drawing Shapes"
  },
  {
    name: "triangle",
    signature: "triangle(x1, y1, x2, y2, x3, y3, color)",
    description: "Draw a triangle with three corner points and a color",
    examples: ['triangle(50, 20, 40, 40, 60, 40, "orange")', 'triangle(10, 10, 20, 10, 15, 20, "black")'],
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
