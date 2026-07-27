import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "Number",
    signature: "Number(string)",
    description: "functions.number.description",
    examples: ['Number("42") → 42', 'Number("7") → 7'],
    category: "functions.number.category"
  },
  {
    name: "includes",
    signature: '"...".includes(substring)',
    description: "functions.includes.description",
    examples: ['"0123456789".includes("5") → true', '"0123456789".includes("X") → false'],
    category: "functions.includes.category"
  },
  {
    name: "indexOf",
    signature: '"...".indexOf(substring)',
    description: "functions.indexOf.description",
    examples: ['"0123456789".indexOf("5") → 5', '"0123456789".indexOf("X") → -1'],
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
  conceptSlugs: ["string-iteration", "if", "modulo", "for-loops", "continue", "type-conversion"]
};

export default exerciseDefinition;
