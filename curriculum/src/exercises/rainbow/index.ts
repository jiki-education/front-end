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
    signature: "rectangle(left, top, width, height)",
    description: "Draw a rectangle at position (left, top) with the given width and height",
    examples: ["rectangle(0, 0, 1, 100)", "rectangle(50, 0, 1, 100)"],
    category: "Drawing Shapes"
  },
  {
    name: "fill_color_hsl",
    signature: "fill_color_hsl(hue, saturation, luminosity)",
    description: "Set the fill color using HSL values (hue 0-360, saturation 0-100, luminosity 0-100)",
    examples: ["fill_color_hsl(0, 50, 50)", "fill_color_hsl(120, 50, 50)"],
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
