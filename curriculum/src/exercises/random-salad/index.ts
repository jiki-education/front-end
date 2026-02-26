import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "makeSalad",
    signature: "makeSalad(leaves, tomatoes, croutons, dressing)",
    description: "Makes a salad with the given amounts of each ingredient.",
    examples: ["makeSalad(50, 12, 30, 5)"],
    category: "Action"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions
};

export default exerciseDefinition;
