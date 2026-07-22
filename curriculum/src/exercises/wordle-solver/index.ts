import "../../exercise-categories/wordle/exercise.css";
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "addWord",
    signature: "addWord(row, word, states)",
    description: "functions.addWord.description",
    examples: ['addWord(1, "hello", ["correct", "present", "absent", "absent", "correct"])'],
    category: "functions.addWord.category"
  },
  {
    name: "getTargetWord",
    signature: "getTargetWord()",
    description: "functions.getTargetWord.description",
    examples: ["let target = getTargetWord()"],
    category: "functions.getTargetWord.category"
  },
  {
    name: "commonWords",
    signature: "commonWords()",
    description: "functions.commonWords.description",
    examples: ["let words = commonWords()"],
    category: "functions.commonWords.category"
  },
  {
    name: "push",
    signature: "push(list, element)",
    description: "functions.push.description",
    examples: ['push(["a", "b"], "c") // returns ["a", "b", "c"]'],
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
