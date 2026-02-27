import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "fetch",
    signature: "fetch(url, params)",
    description: "Fetches data from a URL with the given parameters and returns a dictionary",
    examples: ['let data = fetch("https://timeapi.io/api/time/current/city", { city: "Amsterdam" })'],
    category: "API"
  },
  {
    name: "concatenate",
    signature: "concatenate(a, b, ...)",
    description: "Combine two or more strings together (provided by level stdlib)",
    examples: ['concatenate("hello", " ", "world") → "hello world"'],
    category: "String Operations"
  },
  {
    name: "hasKey",
    signature: "hasKey(dictionary, key)",
    description: "Check if a key exists in a dictionary, returns true or false (provided by level stdlib)",
    examples: ['hasKey({"name": "Jeremy"}, "name") → true'],
    category: "Dictionary Operations"
  }
];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions
};

export default exerciseDefinition;
