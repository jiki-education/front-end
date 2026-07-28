import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "length",
    signature: "[...].length",
    description: "functions.length.description",
    examples: ['["Jeremy", "Erik", "Aron"].length → 3', "[].length → 0"],
    category: "functions.length.category"
  },
  {
    name: "startsWith",
    signature: '"...".startsWith(prefix)',
    description: "functions.startsWith.description",
    examples: ['"Jeremy".startsWith("Jer") → true', '"Jeremy".startsWith("Erik") → false'],
    category: "functions.startsWith.category"
  }
];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["arrays", "for-loops", "if", "methods"]
};

export default exerciseDefinition;
