import "../../exercise-categories/wordle/exercise.css";
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "colorRow",
    signature: "colorRow(rowIndex, states)",
    description: "Colors a row on the Wordle board with the given states.",
    examples: ['colorRow(1, ["correct", "present", "absent", "absent", "correct"])'],
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
