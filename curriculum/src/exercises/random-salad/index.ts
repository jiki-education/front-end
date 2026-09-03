import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "makeSalad",
    signature: "makeSalad(leaves, tomatoes, croutons, olives)",
    description: "functions.makeSalad.description",
    examples: ["makeSalad(50, 12, 30, 10)"],
    category: "functions.makeSalad.category"
  },
  {
    name: "Math.randomInt",
    signature: "Math.randomInt(min, max)",
    description: "functions.randomInt.description",
    examples: ["Math.randomInt(1, 10)", "Math.randomInt(40, 100)"],
    category: "functions.randomInt.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["random", "variables", "using-functions-with-return-values", "using-functions"]
};

export default exerciseDefinition;
