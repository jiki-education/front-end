import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "push",
    signature: "push(list, element)",
    description: "functions.push.description",
    examples: ['push(["a", "b"], "c") → ["a", "b", "c"]', "push([1, 2], 3) → [1, 2, 3]"],
    category: "functions.push.category"
  },
  {
    name: "sortString",
    signature: "sortString(string)",
    description: "functions.sortString.description",
    examples: ['sortString("dcba") → "abcd"', 'sortString("listen") → "eilnst"'],
    category: "functions.sortString.category"
  }
];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["arrays", "string-iteration", "methods", "function-composition"]
};

export default exerciseDefinition;
