import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "askNumberOfFlowers",
    signature: "askNumberOfFlowers()",
    description: "Returns the **number of flowers** to plant.",
    examples: ["let count = askNumberOfFlowers()"],
    category: "Gardening"
  },
  {
    name: "plant",
    signature: "plant(position)",
    description: "Plants a flower at the given **position**.",
    examples: ["plant(10)", "plant(25)"],
    category: "Gardening"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["scenarios", "return-values", "variables", "repeat"]
};

export default exerciseDefinition;
