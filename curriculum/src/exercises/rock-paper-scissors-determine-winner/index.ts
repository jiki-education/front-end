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
    name: "get_player_1_choice",
    signature: "get_player_1_choice()",
    description: 'Returns player 1\'s choice — one of `"rock"`, `"paper"`, or `"scissors"`.',
    examples: ["set choice to get_player_1_choice()"],
    category: "Game"
  },
  {
    name: "get_player_2_choice",
    signature: "get_player_2_choice()",
    description: 'Returns player 2\'s choice — one of `"rock"`, `"paper"`, or `"scissors"`.',
    examples: ["set choice to get_player_2_choice()"],
    category: "Game"
  },
  {
    name: "announce_result",
    signature: "announce_result(result)",
    description: 'Announces the result of the game. Pass `"player_1"`, `"player_2"`, or `"tie"`.',
    examples: ['announce_result("player_1")', 'announce_result("tie")'],
    category: "Game"
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
