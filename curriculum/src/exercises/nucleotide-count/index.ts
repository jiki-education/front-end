import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "keys",
    signature: "keys(dictionary)",
    description: "functions.keys.description",
    examples: ['keys({ "A": 1, "B": 2 }) -> ["A", "B"]', 'keys({ "name": "Alex" }) -> ["name"]'],
    category: "functions.keys.category"
  }
];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["dictionaries", "updating-dictionaries", "string-iteration", "if"]
};

export default exerciseDefinition;
