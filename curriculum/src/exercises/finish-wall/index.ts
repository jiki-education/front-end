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
    examples: ["rectangle(0, 0, 20, 10)", "rectangle(x * 20, 0, 20, 10)"],
    category: "Drawing Shapes"
  },
  {
    name: "fill_color_hex",
    signature: "fill_color_hex(color)",
    description: "Set the fill color using a hex color code",
    examples: ['fill_color_hex("#AA4A44")', 'fill_color_hex("#FF0000")'],
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
