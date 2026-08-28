import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "startsWith",
    signature: '"...".startsWith(substring)',
    description: "functions.startsWith.description",
    examples: ['"a-b-c".startsWith("a-") → true', '"a-b-c".startsWith("c") → false'],
    category: "functions.startsWith.category"
  },
  {
    name: "endsWith",
    signature: '"...".endsWith(substring)',
    description: "functions.endsWith.description",
    examples: ['"a-b-c".endsWith("-c") → true', '"a-b-c".endsWith("a") → false'],
    category: "functions.endsWith.category"
  },
  {
    name: "replace",
    signature: '"...".replace(target, replacement)',
    description: "functions.replace.description",
    examples: ['"a-b-c".replace("-", "+") → "a+b-c"', '"a-b-c".replace("a-", "") → "b-c"'],
    category: "functions.replace.category"
  },
  {
    name: "concat",
    signature: "[...].concat(otherArray)",
    description: "functions.concat.description",
    examples: ['["a"].concat(["b"]) → ["a", "b"]', "[1, 2].concat([3, 4]) → [1, 2, 3, 4]"],
    category: "functions.concat.category"
  },
  {
    name: "includes",
    signature: "[...].includes(element)",
    description: "functions.includes.description",
    examples: ['["a", "b"].includes("a") → true', '["a", "b"].includes("z") → false'],
    category: "functions.includes.category"
  },
  {
    name: "push",
    signature: "[...].push(element)",
    description: "functions.push.description",
    examples: ['["a", "b"].push("c") → ["a", "b", "c"]', "[1, 2].push(3) → [1, 2, 3]"],
    category: "functions.push.category"
  }
];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["arrays", "string-iteration", "building-arrays", "if"],
  // The intended built-in solution runs a handful of iterations, but a student
  // may still hand-roll length/startsWith/endsWith character by character over
  // both baskets, which costs far more than the global default of 1000.
  interpreterOptions: { maxTotalLoopIterations: 10000 }
};

export default exerciseDefinition;
