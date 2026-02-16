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
    examples: ['rectangle(0, 0, 1, 100, "#ff0000")', "rectangle(50, 0, 1, 100, hsl_to_hex(180, 50, 50))"],
    category: "Drawing Shapes"
  },
  {
    name: "hsl_to_hex",
    signature: "hsl_to_hex(hue, saturation, luminosity)",
    description: "Convert HSL color values (hue 0-360, saturation 0-100, luminosity 0-100) to a hex color string",
    examples: ["hsl_to_hex(0, 50, 50)", "hsl_to_hex(120, 50, 50)"],
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
