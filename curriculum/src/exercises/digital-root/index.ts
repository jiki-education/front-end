import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "Number",
    signature: "Number(string)",
    description: "functions.number.description",
    examples: ['Number("4") → 4', 'Number("9") → 9'],
    category: "functions.number.category"
  }
];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["repeat-while", "string-iteration", "string-templates"]
};

export default exerciseDefinition;
