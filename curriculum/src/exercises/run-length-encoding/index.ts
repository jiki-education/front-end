import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "Number",
    signature: "Number(string)",
    description: "functions.number.description",
    examples: ['Number("2") → 2', 'Number("4") → 4'],
    category: "functions.number.category"
  },
  {
    name: "includes",
    signature: '"...".includes(substring)',
    description: "functions.includes.description",
    examples: ['"0123456789".includes("2") → true', '"0123456789".includes("A") → false'],
    category: "functions.includes.category"
  }
];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["string-iteration", "for-loops", "nested-loops", "string-templates", "type-conversion"]
};

export default exerciseDefinition;
