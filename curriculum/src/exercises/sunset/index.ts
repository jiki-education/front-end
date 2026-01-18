import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseDefinition, FunctionInfo } from "../types";

import solutionJavascript from "./solution.javascript";
import solutionPython from "./solution.py";
import solutionJikiscript from "./solution.jiki";
import stubJavascript from "./stub.javascript";
import stubPython from "./stub.py";
import stubJikiscript from "./stub.jiki";

const functions: FunctionInfo[] = [
  {
    name: "circle",
    signature: "circle(center_x, center_y, radius)",
    description: "Draw a circle with its center at (center_x, center_y) and the given radius",
    examples: ["circle(50, 50, 10)", "circle(25, 75, 5)"],
    category: "Drawing Shapes"
  },
  {
    name: "rectangle",
    signature: "rectangle(left, top, width, height)",
    description: "Draw a rectangle at position (left, top) with the given width and height",
    examples: ["rectangle(0, 0, 100, 100)", "rectangle(10, 20, 30, 40)"],
    category: "Drawing Shapes"
  },
  {
    name: "fill_color_rgb",
    signature: "fill_color_rgb(red, green, blue)",
    description: "Set the fill color using RGB values (each 0-255)",
    examples: ["fill_color_rgb(255, 0, 0)", "fill_color_rgb(255, 237, 0)"],
    category: "Colors"
  },
  {
    name: "fill_color_hsl",
    signature: "fill_color_hsl(hue, saturation, luminosity)",
    description: "Set the fill color using HSL values (hue 0-360, saturation 0-100, luminosity 0-100)",
    examples: ["fill_color_hsl(210, 70, 60)", "fill_color_hsl(0, 100, 50)"],
    category: "Colors"
  },
  {
    name: "fill_color_hex",
    signature: "fill_color_hex(color)",
    description: "Set the fill color using a hex color code or HTML color name",
    examples: ['fill_color_hex("#0308ce")', 'fill_color_hex("#C2B280")'],
    category: "Colors"
  }
];

const exerciseDefinition: VisualExerciseDefinition = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  solutions: {
    javascript: solutionJavascript,
    python: solutionPython,
    jikiscript: solutionJikiscript
  },
  stubs: {
    javascript: stubJavascript,
    python: stubPython,
    jikiscript: stubJikiscript
  }
};

export default exerciseDefinition;
