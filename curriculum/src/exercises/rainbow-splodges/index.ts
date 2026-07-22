import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "circle",
    signature: "circle(centerX, centerY, radius, color)",
    description: "functions.circle.description",
    examples: ['circle(50, 50, 10, "#ff0000")', "circle(25, 75, 3, hsl(180, 80, 50))"],
    category: "functions.circle.category"
  },
  {
    name: "hsl",
    signature: "hsl(hue, saturation, lightness)",
    description: "functions.hsl.description",
    examples: ["hsl(0, 80, 50)", "hsl(120, 80, 50)"],
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
  conceptSlugs: ["random", "repeat", "hsl", "using-functions", "using-functions-with-return-values"],
  interpreterOptions: {
    repeatDelay: 5
  }
};

export default exerciseDefinition;
