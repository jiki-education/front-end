import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "askAge",
    signature: "askAge()",
    description: "Returns the **age** of the person waiting outside.",
    examples: ["let age = askAge()"],
    category: "Information"
  },
  {
    name: "letIn",
    signature: "letIn()",
    description: "Lets the person in.",
    examples: ["letIn()"],
    category: "Action"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["if", "conditionals"]
};

export default exerciseDefinition;
