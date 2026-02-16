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
    signature: "circle(center_x, center_y, radius, color)",
    description: "Draw a circle with its center at (center_x, center_y), the given radius, and color",
    examples: ['circle(50, 50, 10, "#ff0000")', "circle(50, sun_cy, sun_radius, rgb_to_hex(255, 237, 0))"],
    category: "Drawing Shapes"
  },
  {
    name: "rectangle",
    signature: "rectangle(left, top, width, height, color)",
    description: "Draw a rectangle at position (left, top) with the given width, height, and color",
    examples: ['rectangle(0, 0, 100, 100, "#0308ce")', "rectangle(0, 0, 100, 100, hsl_to_hex(210, 70, 60))"],
    category: "Drawing Shapes"
  },
  {
    name: "rgb_to_hex",
    signature: "rgb_to_hex(red, green, blue)",
    description: "Convert RGB color values (each 0-255) to a hex color string",
    examples: ["rgb_to_hex(255, 0, 0)", "rgb_to_hex(255, 237, 0)"],
    category: "Colors"
  },
  {
    name: "hsl_to_hex",
    signature: "hsl_to_hex(hue, saturation, luminosity)",
    description: "Convert HSL color values (hue 0-360, saturation 0-100, luminosity 0-100) to a hex color string",
    examples: ["hsl_to_hex(210, 70, 60)", "hsl_to_hex(0, 100, 50)"],
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
