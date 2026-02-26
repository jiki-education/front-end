import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "fetch",
    signature: "fetch(url, params)",
    description:
      "Fetch data from an API. Takes a URL string and a params dictionary. Returns the API response as a dictionary.",
    examples: ['let data = fetch("https://myllm.com/api/v2/qanda", { "question": "What is 1+1?" })'],
    category: "API"
  },
  {
    name: "concatenate",
    signature: "concatenate(a, b, ...)",
    description: "Combine two or more strings together (provided by level stdlib)",
    examples: ['concatenate("hello", " ", "world") // returns "hello world"'],
    category: "String Operations"
  },
  {
    name: "stringToNumber",
    signature: "stringToNumber(str)",
    description: "Convert a string to a number (provided by level stdlib)",
    examples: ['stringToNumber("42") // returns 42'],
    category: "Type Conversion"
  },
  {
    name: "numberToString",
    signature: "numberToString(num)",
    description: "Convert a number to a string (provided by level stdlib)",
    examples: ['numberToString(42) // returns "42"'],
    category: "Type Conversion"
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
