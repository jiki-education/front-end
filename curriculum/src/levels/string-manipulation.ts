import type { Level } from "./types";

const stringManipulation: Level = {
  id: "string-manipulation",
  title: "String Manipulation",
  description: "Learn to build strings by joining values together using concatenation and template literals.",
  taughtConcepts: ["String concatenation", "Template literals"],
  languageFeatures: {
    jikiscript: {
      languageFeatures: {
        allowedStdlibFunctions: ["concatenate", "number_to_string"]
      }
    },
    javascript: {
      allowedNodes: ["TemplateLiteralExpression"],
      languageFeatures: {}
    }
  }
};

export { stringManipulation };
