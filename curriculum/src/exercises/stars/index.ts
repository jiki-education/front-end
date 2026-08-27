import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "push",
    signature: "[...].push(element)",
    description: "functions.push.description",
    examples: ['["a", "b"].push("c") → ["a", "b", "c"]', "[1, 2].push(3) → [1, 2, 3]"],
    category: "functions.push.category"
  },
  {
    name: "drawStars",
    signature: "drawStars(array)",
    description: "functions.drawStars.description",
    examples: ['drawStars(["*", "**"])'],
    category: "functions.drawStars.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["arrays", "building-arrays", "for-loops", "repeat", "string-concatenation"]
};

export default exerciseDefinition;
