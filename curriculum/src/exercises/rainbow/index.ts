import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "rectangle",
    signature: "rectangle(left, top, width, height, color)",
    description: "functions.rectangle.description",
    examples: ['rectangle(0, 0, 1, 100, "#ff0000")', "rectangle(50, 0, 1, 100, hsl(180, 50, 50))"],
    category: "functions.rectangle.category"
  },
  {
    name: "hsl",
    signature: "hsl(hue, saturation, lightness)",
    description: "functions.hsl.description",
    examples: ["hsl(0, 50, 50)", "hsl(120, 50, 50)"],
    category: "functions.hsl.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["repeat", "variables", "hsl", "function-composition"]
};

export default exerciseDefinition;
