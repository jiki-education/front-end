import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "rectangle",
    signature: "rectangle(left, top, width, height, color)",
    description: "Draw a rectangle at position (left, top) with the given width, height, and color",
    examples: ['rectangle(0, 0, 1, 100, "#ff0000")', "rectangle(50, 0, 1, 100, hsl(180, 50, 50))"],
    category: "Drawing Shapes"
  },
  {
    name: "hsl",
    signature: "hsl(hue, saturation, luminosity)",
    description: "Convert HSL color values (hue 0-360, saturation 0-100, luminosity 0-100) to a color string",
    examples: ["hsl(0, 50, 50)", "hsl(120, 50, 50)"],
    category: "Colors"
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
