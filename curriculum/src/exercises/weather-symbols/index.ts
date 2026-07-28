import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "draw",
    signature: "draw(box, day, elements)",
    description: "functions.draw.description",
    examples: ['draw(0, "Monday", ["sun", "cloud"])'],
    category: "functions.draw.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["arrays", "for-loops", "if", "else-if", "function-composition"]
};

export default exerciseDefinition;
