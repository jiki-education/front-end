import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "askName",
    signature: "askName()",
    description: "Returns the **name** of the person at the door.",
    examples: ["let name = askName()"],
    category: "Information"
  },
  {
    name: "getAllowedStart",
    signature: "getAllowedStart()",
    description: "Returns the required **starting letters** for tonight's party.",
    examples: ["let allowedStart = getAllowedStart()"],
    category: "Information"
  },
  {
    name: "letIn",
    signature: "letIn()",
    description: "Lets the person into the party.",
    examples: ["letIn()"],
    category: "Action"
  },
  {
    name: "turnAway",
    signature: "turnAway()",
    description: "Turns the person away from the party.",
    examples: ["turnAway()"],
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
