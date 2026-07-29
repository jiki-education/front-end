import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "push",
    signature: "array.push(element)",
    description: "functions.push.description",
    examples: ['let letters = ["a", "b"]', 'letters.push("c") // letters is now ["a", "b", "c"]'],
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
