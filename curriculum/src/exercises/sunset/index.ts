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
    signature: "circle(centerX, centerY, radius, color)",
    description: "Draw a circle with its center at (centerX, centerY), the given radius, and color",
    examples: ['circle(50, 50, 10, "#ff0000")', "circle(50, sunCy, sunRadius, rgbToHex(255, 237, 0))"],
    category: "Drawing Shapes"
  },
  {
    name: "rectangle",
    signature: "rectangle(left, top, width, height, color)",
    description: "Draw a rectangle at position (left, top) with the given width, height, and color",
    examples: ['rectangle(0, 0, 100, 100, "#0308ce")', "rectangle(0, 0, 100, 100, hslToHex(210, 70, 60))"],
    category: "Drawing Shapes"
  },
  {
    name: "rgbToHex",
    signature: "rgbToHex(red, green, blue)",
    description: "Convert RGB color values (each 0-255) to a hex color string",
    examples: ["rgbToHex(255, 0, 0)", "rgbToHex(255, 237, 0)"],
    category: "Colors"
  },
  {
    name: "hslToHex",
    signature: "hslToHex(hue, saturation, luminosity)",
    description: "Convert HSL color values (hue 0-360, saturation 0-100, luminosity 0-100) to a hex color string",
    examples: ["hslToHex(210, 70, 60)", "hslToHex(0, 100, 50)"],
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
