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
    name: "giveChildWristband",
    signature: "giveChildWristband()",
    description: "Gives the person a **child** wristband (under 13).",
    examples: ["giveChildWristband()"],
    category: "Wristbands"
  },
  {
    name: "giveTeenWristband",
    signature: "giveTeenWristband()",
    description: "Gives the person a **teen** wristband (13-17).",
    examples: ["giveTeenWristband()"],
    category: "Wristbands"
  },
  {
    name: "giveAdultWristband",
    signature: "giveAdultWristband()",
    description: "Gives the person an **adult** wristband (18-64).",
    examples: ["giveAdultWristband()"],
    category: "Wristbands"
  },
  {
    name: "giveSeniorWristband",
    signature: "giveSeniorWristband()",
    description: "Gives the person a **senior** wristband (65+).",
    examples: ["giveSeniorWristband()"],
    category: "Wristbands"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  conceptSlugs: ["if", "else-if", "conditionals"],
  tasks,
  scenarios,
  functions
};

export default exerciseDefinition;
