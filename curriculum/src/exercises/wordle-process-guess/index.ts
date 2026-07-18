import "../../exercise-categories/wordle/exercise.css";
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "colorRow",
    signature: "colorRow(rowIndex, states)",
    description: "functions.colorRow.description",
    examples: ['colorRow(1, ["correct", "present", "absent", "absent", "correct"])'],
    category: "functions.colorRow.category"
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
  functions
};

export default exerciseDefinition;
