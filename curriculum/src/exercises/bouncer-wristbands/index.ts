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
    name: "childWristband",
    signature: "childWristband()",
    description: "Gives the person a **child** wristband (under 13).",
    examples: ["childWristband()"],
    category: "Wristbands"
  },
  {
    name: "teenWristband",
    signature: "teenWristband()",
    description: "Gives the person a **teen** wristband (13-17).",
    examples: ["teenWristband()"],
    category: "Wristbands"
  },
  {
    name: "adultWristband",
    signature: "adultWristband()",
    description: "Gives the person an **adult** wristband (18-64).",
    examples: ["adultWristband()"],
    category: "Wristbands"
  },
  {
    name: "seniorWristband",
    signature: "seniorWristband()",
    description: "Gives the person a **senior** wristband (65+).",
    examples: ["seniorWristband()"],
    category: "Wristbands"
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
