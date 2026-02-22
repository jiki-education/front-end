import type { Level } from "./types";

const stringsAndColors: Level = {
  id: "strings-and-colors",
  title: "Strings and Colors",
  description: "Learn how to use strings and colors to make your programs more colorful and expressive.",
  taughtConcepts: ['Passing string and number literals as inputs to functions (use "inputs" not "arguments")'],
  languageFeatures: {
    javascript: {
      languageFeatures: {
        allowTruthiness: false,
        allowTypeCoercion: false,
        enforceStrictEquality: true,
        allowShadowing: false
      }
    }
  }
};

export { stringsAndColors };
