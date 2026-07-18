import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "fetch",
    signature: "fetch(url, params)",
    description: "functions.fetch.description",
    examples: ['let data = fetch("https://myllm.com/api/v2/qanda", { "question": "What is 1+1?" })'],
    category: "functions.fetch.category"
  },
  {
    name: "stringToNumber",
    signature: "stringToNumber(str)",
    description: "functions.stringToNumber.description",
    examples: ['stringToNumber("42") // returns 42'],
    category: "functions.stringToNumber.category"
  },
  {
    name: "numberToString",
    signature: "numberToString(num)",
    description: "functions.numberToString.description",
    examples: ['numberToString(42) // returns "42"'],
    category: "functions.numberToString.category"
  }
];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["arrays", "dictionaries", "string-templates", "function-composition"]
};

export default exerciseDefinition;
