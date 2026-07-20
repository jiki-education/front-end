import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "askNumberOfFlowers",
    signature: "askNumberOfFlowers()",
    description: "functions.askNumberOfFlowers.description",
    examples: ["let count = askNumberOfFlowers()"],
    category: "functions.askNumberOfFlowers.category"
  },
  {
    name: "plant",
    signature: "plant(position)",
    description: "functions.plant.description",
    examples: ["plant(10)", "plant(25)"],
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
  conceptSlugs: ["scenarios", "using-functions-with-return-values", "variables", "repeat"]
};

export default exerciseDefinition;
