import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "rectangle",
    signature: "rectangle(left, top, width, height)",
    description: "functions.rectangle.description",
    examples: ["rectangle(10, 10, 20, 10)", "rectangle(0, 0, 100, 50)"],
    category: "functions.rectangle.category"
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
