import "../../exercise-categories/rock-paper-scissors/exercise.css";
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "getYukiChoice",
    signature: "getYukiChoice()",
    description: "functions.getYukiChoice.description",
    examples: ["let choice = getYukiChoice()"],
    category: "functions.getYukiChoice.category"
  },
  {
    name: "getAndoChoice",
    signature: "getAndoChoice()",
    description: "functions.getAndoChoice.description",
    examples: ["let choice = getAndoChoice()"],
    category: "functions.getAndoChoice.category"
  },
  {
    name: "announceResult",
    signature: "announceResult(result)",
    description: "functions.announceResult.description",
    examples: ['announceResult("Yuki")', 'announceResult("tie")'],
    category: "functions.announceResult.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["logical-and", "if", "else-if", "else"]
};

export default exerciseDefinition;
