import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "circle",
    signature: "circle(centerX, centerY, radius)",
    description: "functions.circle.description",
    examples: ["circle(50, 40, 15)", "circle(50, 70, 20)"],
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
  conceptSlugs: ["using-functions", "using-functions-with-inputs"],
  disableLogTab: true
};

export default exerciseDefinition;
