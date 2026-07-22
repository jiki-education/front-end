import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "rectangle",
    signature: "rectangle(left, top, width, height, color)",
    description: "functions.rectangle.description",
    examples: ['rectangle(30, 10, 40, 80, "charcoal")'],
    category: "functions.rectangle.category"
  },
  {
    name: "circle",
    signature: "circle(centerX, centerY, radius, color)",
    description: "functions.circle.description",
    examples: ['circle(50, 30, 10, "red")'],
    category: "functions.circle.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["variables", "arithmetic", "using-functions-with-inputs"],
  readonlyRanges: {
    javascript: [
      { fromLine: 1, toLine: 5 },
      { fromLine: 6, toLine: 6, toChar: 13 }
    ]
  }
};

export default exerciseDefinition;
