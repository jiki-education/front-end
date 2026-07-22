import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "push",
    signature: "push(list, element)",
    description: "functions.push.description",
    examples: ['push(["a", "b"], "c") -> ["a", "b", "c"]', "push([1, 2], 3) -> [1, 2, 3]"],
    category: "functions.push.category"
  },
  {
    name: "concat",
    signature: "concat(list1, list2)",
    description: "functions.concat.description",
    examples: ['concat(["a"], ["b"]) -> ["a", "b"]', "concat([1, 2], [3, 4]) -> [1, 2, 3, 4]"],
    category: "functions.concat.category"
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
  interpreterOptions: { maxTotalLoopIterations: 10000 }
};

export default exerciseDefinition;
