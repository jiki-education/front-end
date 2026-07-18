import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "fetch",
    signature: "fetch(url, params)",
    description: "functions.fetch.description",
    examples: [
      'fetch("https://api.spotify.com/v1/users/fred", {}) // returns {items: [...]}',
      'fetch("https://api.spotify.com/v1/artists/abc123", {}) // returns {name: "Artist Name"}'
    ],
    category: "functions.fetch.category"
  },
  {
    name: "push",
    signature: "push(list, element)",
    description: "functions.push.description",
    examples: ['push(["a"], "b") // returns ["a", "b"]'],
    category: "functions.push.category"
  },
  {
    name: "hasKey",
    signature: "hasKey(dictionary, key)",
    description: "functions.hasKey.description",
    examples: ['hasKey({"name": "Jeremy"}, "name") // returns true'],
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
  conceptSlugs: ["dictionaries", "string-templates", "if", "using-functions-with-return-values"]
};

export default exerciseDefinition;
