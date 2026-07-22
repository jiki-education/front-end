import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "rectangle",
    signature: "rectangle(left, top, width, height, color)",
    description: "functions.rectangle.description",
    examples: ['rectangle(25, 50, 50, 10, "white")'],
    category: "functions.rectangle.category"
  },
  {
    name: "circle",
    signature: "circle(centerX, centerY, radius, color)",
    description: "functions.circle.description",
    examples: ['circle(75, 30, 15, "yellow")'],
    category: "functions.circle.category"
  },
  {
    name: "ellipse",
    signature: "ellipse(centerX, centerY, radiusX, radiusY, color)",
    description: "functions.ellipse.description",
    examples: ['ellipse(30, 70, 3, 5, "blue")'],
    category: "functions.ellipse.category"
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
  readonlyRanges: {
    javascript: [{ fromLine: 4, toLine: 4 }],
    python: [{ fromLine: 4, toLine: 4 }],
    jikiscript: [{ fromLine: 4, toLine: 4 }]
  },
  disableLogTab: true
};

export default exerciseDefinition;
