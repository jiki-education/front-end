import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "plant",
    signature: "plant(position)",
    description: "functions.plant.description",
    examples: ["plant(10)", "plant(20)"],
    category: "functions.plant.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["repeat", "using-functions", "variables"]
};

export default exerciseDefinition;
