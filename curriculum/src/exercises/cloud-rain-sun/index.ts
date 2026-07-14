import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import { progressionMetrics } from "./progressionMetrics";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "rectangle",
    signature: "rectangle(left, top, width, height, color)",
    description: "Draw a rectangle at position (left, top) with the given width, height, and color",
    examples: ['rectangle(25, 50, 50, 10, "white")'],
    category: "Drawing Shapes"
  },
  {
    name: "circle",
    signature: "circle(centerX, centerY, radius, color)",
    description: "Draw a circle centered at (centerX, centerY) with the given radius and color",
    examples: ['circle(75, 30, 15, "yellow")'],
    category: "Drawing Shapes"
  },
  {
    name: "ellipse",
    signature: "ellipse(centerX, centerY, radiusX, radiusY, color)",
    description:
      "Draw an ellipse centered at (centerX, centerY) with horizontal radius radiusX, vertical radius radiusY, and color",
    examples: ['ellipse(30, 70, 3, 5, "blue")'],
    category: "Drawing Shapes"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  progressionMetrics,
  functions,
  conceptSlugs: ["using-functions", "using-functions-with-inputs", "strings"],
  readonlyRanges: {
    javascript: [{ fromLine: 4, toLine: 4 }],
    python: [{ fromLine: 4, toLine: 4 }],
    jikiscript: [{ fromLine: 4, toLine: 4 }]
  },
  disableLogTab: true
};

export default exerciseDefinition;
