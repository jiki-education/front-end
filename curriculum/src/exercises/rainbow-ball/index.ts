import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "circle",
    signature: "circle(cx, cy, radius, color)",
    description: "Draw a circle with its center at (x, y) with the given radius and color",
    examples: ['circle(50, 50, 10, "#ff0000")', "circle(25, 75, 3, hsl(180, 80, 50))"],
    category: "Drawing Shapes"
  },
  {
    name: "hsl",
    signature: "hsl(hue, saturation, luminosity)",
    description: "Convert HSL color values (hue 0-360, saturation 0-100, luminosity 0-100) to a hex color string",
    examples: ["hsl(0, 80, 50)", "hsl(120, 80, 50)"],
    category: "Colors"
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
