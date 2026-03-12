import "../../exercise-categories/golf/exercise.css";
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "roll",
    signature: "roll()",
    description: "Rolls the ball **one step to the right**.",
    examples: ["roll()"],
    category: "Movement"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["repeat", "using-functions"]
};

export default exerciseDefinition;
