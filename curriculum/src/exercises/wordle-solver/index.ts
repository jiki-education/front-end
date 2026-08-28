import "../../exercise-categories/wordle/exercise.css";
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "guess",
    signature: "guess(word)",
    description: "functions.guess.description",
    examples: ['let states = guess("which")'],
    category: "functions.guess.category"
  },
  {
    name: "commonWords",
    signature: "commonWords()",
    description: "functions.commonWords.description",
    examples: ["let words = commonWords()"],
    category: "functions.commonWords.category"
  },
  {
    name: "includes",
    signature: "[...].includes(item)",
    description: "functions.arrayIncludes.description",
    examples: ['["a", "b"].includes("b") → true', '["a", "b"].includes("z") → false'],
    category: "functions.arrayIncludes.category"
  },
  {
    name: "includes",
    signature: '"...".includes(substring)',
    description: "functions.stringIncludes.description",
    examples: ['"hello".includes("ell") → true', '"hello".includes("xyz") → false'],
    category: "functions.stringIncludes.category"
  },
  {
    name: "length",
    signature: "[...].length",
    description: "functions.arrayLength.description",
    examples: ['["a", "b", "c"].length → 3', "[].length → 0"],
    category: "functions.arrayLength.category"
  },
  {
    name: "length",
    signature: '"...".length',
    description: "functions.stringLength.description",
    examples: ['"hello".length → 5', '"".length → 0'],
    category: "functions.stringLength.category"
  },
  {
    name: "push",
    signature: "[...].push(element)",
    description: "functions.push.description",
    examples: ['["a", "b"].push("c") → ["a", "b", "c"]', "[1, 2].push(3) → [1, 2, 3]"],
    category: "functions.push.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: [
    "arrays",
    "building-arrays",
    "dictionaries",
    "string-indexing",
    "if",
    "while-loops",
    "logical-not",
    "creating-functions-with-return-values"
  ],
  interpreterOptions: { maxTotalLoopIterations: 5000 }
};

export default exerciseDefinition;
