import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "triangle",
    signature: "triangle(x1, y1, x2, y2, x3, y3, color)",
    description: "functions.triangle.description",
    examples: ['triangle(10, 40, 10, 5, 50, 40, "brown")'],
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
