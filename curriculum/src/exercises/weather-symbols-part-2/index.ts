import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "rectangle",
    signature: "rectangle(left, top, width, height, color)",
    description: "Draw a rectangle at position (left, top) with the given width, height, and color",
    examples: ['rectangle(0, 0, 100, 100, "#ADD8E6")'],
    category: "Drawing Shapes"
  },
  {
    name: "circle",
    signature: "circle(x, y, radius, color)",
    description: "Draw a circle centered at (x, y) with the given radius and color",
    examples: ['circle(75, 30, 15, "#ffed06")'],
    category: "Drawing Shapes"
  },
  {
    name: "ellipse",
    signature: "ellipse(x, y, rx, ry, color)",
    description: "Draw an ellipse centered at (x, y) with horizontal radius rx, vertical radius ry, and color",
    examples: ['ellipse(30, 70, 3, 5, "#56AEFF")'],
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
