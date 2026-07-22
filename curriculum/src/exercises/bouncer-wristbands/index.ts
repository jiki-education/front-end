import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "getAge",
    signature: "getAge()",
    description: "functions.getAge.description",
    examples: ["let age = getAge()"],
    category: "functions.getAge.category"
  },
  {
    name: "giveChildWristband",
    signature: "giveChildWristband()",
    description: "functions.giveChildWristband.description",
    examples: ["giveChildWristband()"],
    category: "functions.giveChildWristband.category"
  },
  {
    name: "giveTeenWristband",
    signature: "giveTeenWristband()",
    description: "functions.giveTeenWristband.description",
    examples: ["giveTeenWristband()"],
    category: "functions.giveTeenWristband.category"
  },
  {
    name: "giveAdultWristband",
    signature: "giveAdultWristband()",
    description: "functions.giveAdultWristband.description",
    examples: ["giveAdultWristband()"],
    category: "functions.giveAdultWristband.category"
  },
  {
    name: "giveSeniorWristband",
    signature: "giveSeniorWristband()",
    description: "functions.giveSeniorWristband.description",
    examples: ["giveSeniorWristband()"],
    category: "functions.giveSeniorWristband.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  conceptSlugs: ["if", "else-if"],
  tasks,
  scenarios,
  functions
};

export default exerciseDefinition;
