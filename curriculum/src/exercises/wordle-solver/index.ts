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
    description: "functions.includes.description",
    examples: ['["a", "b"].includes("b") → true', '"hello".includes("ell") → true'],
    category: "functions.includes.category"
  },
  {
    name: "length",
    signature: "[...].length",
    description: "functions.length.description",
    examples: ['["a", "b", "c"].length → 3', '"hello".length → 5'],
    category: "functions.length.category"
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
  interpreterOptions: { maxTotalLoopIterations: 5000 }
};

export default exerciseDefinition;
