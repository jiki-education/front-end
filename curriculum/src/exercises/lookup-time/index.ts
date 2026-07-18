import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "fetch",
    signature: "fetch(url, params)",
    description: "functions.fetch.description",
    examples: ['let data = fetch("https://timeapi.io/api/time/current/city", { city: "Amsterdam" })'],
    category: "functions.fetch.category"
  },
  {
    name: "hasKey",
    signature: "hasKey(dictionary, key)",
    description: "functions.hasKey.description",
    examples: ['hasKey({"name": "Jeremy"}, "name") → true'],
    category: "functions.hasKey.category"
  }
];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["dictionaries", "using-functions-with-return-values", "if", "string-templates"]
};

export default exerciseDefinition;
