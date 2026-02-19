import type { Level } from "./types";

const methodsAndProperties: Level = {
  id: "methods-and-properties",
  title: "Methods and Properties",
  description: "Learn to use methods and properties on objects to access and transform data.",
  taughtConcepts: ["Calling methods on values", "Accessing properties"],
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
