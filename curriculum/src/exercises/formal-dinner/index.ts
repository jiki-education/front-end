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
    name: "split",
    signature: '"...".split(separator)',
    description: "functions.split.description",
    examples: ['"Jeremy".split("e") → ["J", "r", "my"]', '"a-b-c".split("-") → ["a", "b", "c"]'],
    category: "functions.split.category"
  },
  {
    name: "slice",
    signature: "[...].slice(start)",
    description: "functions.slice.description",
    examples: ['["Jeremy", "Erik", "Aron", "DJ"].slice(2) → ["Aron", "DJ"]', '["Jeremy", "Erik"].slice(1) → ["Erik"]'],
    category: "functions.slice.category"
  },
  {
    name: "join",
    signature: "[...].join(separator)",
    description: "functions.join.description",
    examples: ['["Jeremy", "Erik"].join(" likes ") → "Jeremy likes Erik"', '["a", "b", "c"].join("-") → "a-b-c"'],
    category: "functions.join.category"
  },
  {
    name: "endsWith",
    signature: '"...".endsWith(suffix)',
    description: "functions.endsWith.description",
    examples: ['"Jeremy".endsWith("emy") → true', '"Jeremy".endsWith("Erik") → false'],
    category: "functions.endsWith.category"
  }
];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["arrays", "methods", "if", "for-loops"]
};

export default exerciseDefinition;
