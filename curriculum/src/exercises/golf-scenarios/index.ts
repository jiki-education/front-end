import "../../exercise-categories/golf/exercise.css";
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "moveTo",
    signature: "moveTo(x)",
    description: "functions.moveTo.description",
    examples: ["moveTo(30)", "moveTo(50)"],
    category: "functions.moveTo.category"
  },
  {
    name: "getShotLength",
    signature: "getShotLength()",
    description: "functions.getShotLength.description",
    examples: ["let shotLength = getShotLength()"],
    category: "functions.getShotLength.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["scenarios", "using-functions-with-inputs", "using-functions-with-return-values"]
};

export default exerciseDefinition;
