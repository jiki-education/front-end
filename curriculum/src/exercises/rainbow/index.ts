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
    name: "rectangle",
    signature: "rectangle(left, top, width, height, color)",
    description: "Draw a rectangle at position (left, top) with the given width, height, and color",
    examples: ['rectangle(0, 0, 1, 100, "#ff0000")', "rectangle(50, 0, 1, 100, hslToHex(180, 50, 50))"],
    category: "Drawing Shapes"
  },
  {
    name: "hslToHex",
    signature: "hslToHex(hue, saturation, luminosity)",
    description: "Convert HSL color values (hue 0-360, saturation 0-100, luminosity 0-100) to a hex color string",
    examples: ["hslToHex(0, 50, 50)", "hslToHex(120, 50, 50)"],
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
