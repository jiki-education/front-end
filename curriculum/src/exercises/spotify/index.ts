import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseDefinition, FunctionInfo } from "../types";

import solutionJavascript from "./solution.javascript";
import solutionPython from "./solution.py";
import solutionJikiscript from "./solution.jiki";
import stubJavascript from "./stub.javascript";
import stubPython from "./stub.py";
import stubJikiscript from "./stub.jiki";

const functions: FunctionInfo[] = [
  {
    name: "fetch",
    signature: "fetch(url, params)",
    description:
      "Fetch data from an API. Takes a URL string and a params dictionary. Returns the API response as a dictionary.",
    examples: [
      'fetch("https://api.spotify.com/v1/users/fred", {}) // returns {items: [...]}',
      'fetch("https://api.spotify.com/v1/artists/abc123", {}) // returns {name: "Artist Name"}'
    ],
    category: "API"
  },
  {
    name: "concatenate",
    signature: "concatenate(a, b)",
    description: "Combine two or more strings together (provided by level stdlib)",
    examples: ['concatenate("hello", " world") // returns "hello world"'],
    category: "String Operations"
  },
  {
    name: "push",
    signature: "push(list, element)",
    description: "Add an element to a list and return the new list (provided by level stdlib)",
    examples: ['push(["a"], "b") // returns ["a", "b"]'],
    category: "List Operations"
  },
  {
    name: "hasKey",
    signature: "hasKey(dictionary, key)",
    description: "Check if a key exists in a dictionary, returns true or false (provided by level stdlib)",
    examples: ['hasKey({"name": "Jeremy"}, "name") // returns true'],
    category: "Dictionary Operations"
  }
];

const exerciseDefinition: IOExerciseDefinition = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  solutions: {
    javascript: solutionJavascript,
    python: solutionPython,
    jikiscript: solutionJikiscript
  },
  stubs: {
    javascript: stubJavascript,
    python: stubPython,
    jikiscript: stubJikiscript
  }
};

export default exerciseDefinition;
