import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "circle",
    signature: "circle(centerX, centerY, radius, color)",
    description: "Draw a circle with its center at (centerX, centerY), the given radius, and color",
    examples: ['circle(50, 50, 10, "#ff0000")', "circle(50, sunCy, sunRadius, rgb(255, 237, 0))"],
    category: "Drawing Shapes"
  },
  {
    name: "rectangle",
    signature: "rectangle(left, top, width, height, color)",
    description: "Draw a rectangle at position (left, top) with the given width, height, and color",
    examples: ['rectangle(0, 0, 100, 100, "#0308ce")', "rectangle(0, 0, 100, 100, hsl(210, 70, 60))"],
    category: "Drawing Shapes"
  },
  {
    name: "rgb",
    signature: "rgb(red, green, blue)",
    description: "Convert RGB color values (each 0-255) to a hex color string",
    examples: ["rgb(255, 0, 0)", "rgb(255, 237, 0)"],
    category: "Colors"
  },
  {
    name: "hsl",
    signature: "hsl(hue, saturation, luminosity)",
    description: "Convert HSL color values (hue 0-360, saturation 0-100, luminosity 0-100) to a hex color string",
    examples: ["hsl(210, 70, 60)", "hsl(0, 100, 50)"],
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
  conceptSlugs: ["repeat", "variables", "hsl", "rgb", "using-functions", "return-values"],
  interpreterOptions: {
    repeatDelay: 20
  }
};

export default exerciseDefinition;
