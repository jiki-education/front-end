import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "getAge",
    signature: "getAge()",
    description: "Returns the **age** of the person waiting outside.",
    examples: ["let age = getAge()"],
    category: "Information"
  },
  {
    name: "openDoor",
    signature: "openDoor()",
    description: "Opens the door to let the person in.",
    examples: ["openDoor()"],
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
