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
    name: "getPlayer1Choice",
    signature: "getPlayer1Choice()",
    description: 'Returns player 1\'s choice — one of `"rock"`, `"paper"`, or `"scissors"`.',
    examples: ["let choice = getPlayer1Choice()"],
    category: "Game"
  },
  {
    name: "getPlayer2Choice",
    signature: "getPlayer2Choice()",
    description: 'Returns player 2\'s choice — one of `"rock"`, `"paper"`, or `"scissors"`.',
    examples: ["let choice = getPlayer2Choice()"],
    category: "Game"
  },
  {
    name: "announceResult",
    signature: "announceResult(result)",
    description: 'Announces the result of the game. Pass `"player_1"`, `"player_2"`, or `"tie"`.',
    examples: ['announceResult("player_1")', 'announceResult("tie")'],
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
