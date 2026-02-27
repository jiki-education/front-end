import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "currentTimeHour",
    signature: "currentTimeHour()",
    description: "Returns the current hour using 24-hour time (e.g. 23 for 11pm) as a number.",
    examples: ["let hour = currentTimeHour()"],
    category: "Time"
  },
  {
    name: "currentTimeMinute",
    signature: "currentTimeMinute()",
    description: "Returns the current minute as a number.",
    examples: ["let minutes = currentTimeMinute()"],
    category: "Time"
  },
  {
    name: "displayTime",
    signature: "displayTime(hour, minutes, indicator)",
    description: 'Displays the time on the digital clock. The indicator should be "am" or "pm".',
    examples: ['displayTime(7, 45, "am")'],
    category: "Action"
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
