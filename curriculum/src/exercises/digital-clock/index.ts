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
    name: "current_time_hour",
    signature: "current_time_hour()",
    description: "Returns the current hour using 24-hour time (e.g. 23 for 11pm) as a number.",
    examples: ["set hour to current_time_hour()"],
    category: "Time"
  },
  {
    name: "current_time_minute",
    signature: "current_time_minute()",
    description: "Returns the current minute as a number.",
    examples: ["set minutes to current_time_minute()"],
    category: "Time"
  },
  {
    name: "display_time",
    signature: "display_time(hour, minutes, indicator)",
    description: 'Displays the time on the digital clock. The indicator should be "am" or "pm".',
    examples: ['display_time(7, 45, "am")'],
    category: "Action"
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
