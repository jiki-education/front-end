import type { Level } from "./types";

const methodsAndProperties: Level = {
  id: "methods-and-properties",
  title: "Methods and Properties",
  description: "Learn to use methods and properties on objects to access and transform data.",
  taughtConcepts: ["Calling methods on values", "Accessing properties"],
  languageFeatures: {
    jikiscript: {
      languageFeatures: {
        allowedStdlibFunctions: ["keys", "string_to_number", "to_upper_case"]
      }
    },
    javascript: {
      allowedNodes: ["MemberExpression"],
      languageFeatures: {
        allowedStdlib: {
          string: {
            properties: ["length"],
            methods: [
              "toUpperCase",
              "toLowerCase",
              "indexOf",
              "lastIndexOf",
              "includes",
              "startsWith",
              "endsWith",
              "concat",
              "repeat",
              "replace",
              "replaceAll",
              "split",
              "trim",
              "trimStart",
              "trimEnd",
              "padStart",
              "padEnd"
            ]
          }
        }
      }
    }
  }
};

export { methodsAndProperties };
