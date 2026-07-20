import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "stringToNumber",
    signature: "stringToNumber(str)",
    description: "functions.stringToNumber.description",
    examples: ['stringToNumber("42") // returns 42'],
    category: "functions.stringToNumber.category"
  }
];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["string-iteration", "if", "modulo", "for-loops"]
};

export default exerciseDefinition;
