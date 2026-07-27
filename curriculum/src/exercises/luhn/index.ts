import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "Number",
    signature: "Number(string)",
    description: "functions.number.description",
    examples: ['Number("5") → 5', 'Number("8") → 8'],
    category: "functions.number.category"
  },
  {
    name: "includes",
    signature: '"...".includes(substring)',
    description: "functions.includes.description",
    examples: ['"0123456789".includes("7") → true', '"0123456789".includes("a") → false'],
    category: "functions.includes.category"
  },
  {
    name: "length",
    signature: '"...".length',
    description: "functions.length.description",
    examples: ['"059".length → 3', '"".length → 0'],
    category: "functions.length.category"
  }
];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["string-iteration", "string-indexing", "for-loops", "continue", "modulo", "type-conversion"]
};

export default exerciseDefinition;
