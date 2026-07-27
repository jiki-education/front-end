import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "indexOf",
    signature: '"...".indexOf(substring)',
    description: "functions.indexOf.description",
    examples: ['"abcdefghijklmnopqrstuvwxyz".indexOf("c") → 2', '"abcdefghijklmnopqrstuvwxyz".indexOf(" ") → -1'],
    category: "functions.indexOf.category"
  }
];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["string-iteration", "modulo", "string-concatenation", "function-composition"]
};

export default exerciseDefinition;
