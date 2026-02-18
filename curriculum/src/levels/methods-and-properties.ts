import type { Level } from "./types";

const methodsAndProperties: Level = {
  id: "methods-and-properties",
  title: "Methods and Properties",
  description: "Learn to use methods and properties on objects to access and transform data.",
  educationalGoal:
    "Students learn to call methods on values and access properties, enabling more powerful data manipulation through built-in functionality.",
  languageFeatures: {
    jikiscript: {
      languageFeatures: {
        allowedStdlibFunctions: ["concatenate", "number_to_string", "keys", "string_to_number", "to_upper_case"]
      }
    },
    javascript: {
      allowedNodes: [],
      languageFeatures: {}
    }
  }
};

export { methodsAndProperties };
