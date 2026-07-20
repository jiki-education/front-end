import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "rectangle",
    signature: "rectangle(left, top, width, height, color)",
    description: "functions.rectangle.description",
    examples: ['rectangle(0, 0, 100, 50, "skyblue")', 'rectangle(10, 20, 50, 30, "black")'],
    category: "functions.rectangle.category"
  },
  {
    name: "circle",
    signature: "circle(centerX, centerY, radius, color)",
    description: "functions.circle.description",
    examples: ['circle(50, 50, 10, "black")', 'circle(25, 75, 15, "white")'],
    category: "functions.circle.category"
  },
  {
    name: "ellipse",
    signature: "ellipse(centerX, centerY, radiusX, radiusY, color)",
    description: "functions.ellipse.description",
    examples: ['ellipse(50, 50, 20, 10, "black")', 'ellipse(30, 60, 15, 5, "white")'],
    category: "functions.ellipse.category"
  },
  {
    name: "triangle",
    signature: "triangle(x1, y1, x2, y2, x3, y3, color)",
    description: "functions.triangle.description",
    examples: ['triangle(50, 20, 40, 40, 60, 40, "orange")', 'triangle(10, 10, 20, 10, 15, 20, "black")'],
    category: "functions.triangle.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["using-functions", "using-functions-with-inputs", "strings"],
  disableLogTab: true
};

export default exerciseDefinition;
