import "../../exercise-categories/wordle/exercise.css";
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "addWord",
    signature: "addWord(row, word, states)",
    description: "Adds a word to the Wordle board at the given row (1-6) with its letter states.",
    examples: ['addWord(1, "hello", ["correct", "present", "absent", "absent", "correct"])'],
    category: "Wordle"
  },
  {
    name: "getTargetWord",
    signature: "getTargetWord()",
    description: "Returns the secret target word. Use this to check your guess, not to cheat!",
    examples: ["let target = getTargetWord()"],
    category: "Wordle"
  },
  {
    name: "commonWords",
    signature: "commonWords()",
    description: "Returns a list of 100+ common five-letter words to use as guesses.",
    examples: ["let words = commonWords()"],
    category: "Wordle"
  },
  {
    name: "push",
    signature: "push(list, element)",
    description: "Adds an element to a list and returns the new list. Does not change the original list.",
    examples: ['push(["a", "b"], "c") // returns ["a", "b", "c"]'],
    category: "Lists"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions
};

export default exerciseDefinition;
