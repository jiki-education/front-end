import "../../exercise-categories/rock-paper-scissors/exercise.css";
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "getYukiChoice",
    signature: "getYukiChoice()",
    description: 'Returns Yuki\'s choice — one of `"rock"`, `"paper"`, or `"scissors"`.',
    examples: ["let choice = getYukiChoice()"],
    category: "Game"
  },
  {
    name: "getAndoChoice",
    signature: "getAndoChoice()",
    description: 'Returns Ando\'s choice — one of `"rock"`, `"paper"`, or `"scissors"`.',
    examples: ["let choice = getAndoChoice()"],
    category: "Game"
  },
  {
    name: "announceResult",
    signature: "announceResult(result)",
    description: 'Announces the result of the game. Pass `"Yuki"`, `"Ando"`, or `"tie"`.',
    examples: ['announceResult("Yuki")', 'announceResult("tie")'],
    category: "Game"
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
