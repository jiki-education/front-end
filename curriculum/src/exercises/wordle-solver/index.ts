import "../../exercise-categories/wordle/exercise.css";
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseDefinition, FunctionInfo } from "../types";

import solutionJavascript from "./solution.javascript";
import solutionPython from "./solution.py";
import solutionJikiscript from "./solution.jiki";
import stubJavascript from "./stub.javascript";
import stubPython from "./stub.py";
import stubJikiscript from "./stub.jiki";

const functions: FunctionInfo[] = [
  {
    name: "add_word",
    signature: "add_word(row, word, states)",
    description: "Adds a word to the Wordle board at the given row (1-6) with its letter states.",
    examples: ['add_word(1, "hello", ["correct", "present", "absent", "absent", "correct"])'],
    category: "Wordle"
  },
  {
    name: "get_target_word",
    signature: "get_target_word()",
    description: "Returns the secret target word. Use this to check your guess, not to cheat!",
    examples: ['set target to get_target_word()'],
    category: "Wordle"
  },
  {
    name: "common_words",
    signature: "common_words()",
    description: "Returns a list of 100+ common five-letter words to use as guesses.",
    examples: ["set words to common_words()"],
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

const exerciseDefinition: VisualExerciseDefinition = {
  type: "visual",
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
