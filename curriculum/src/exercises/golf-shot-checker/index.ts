import "../../exercise-categories/golf/exercise.css";
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
    name: "move_ball_right",
    signature: "move_ball_right()",
    description: "Moves the ball **one unit to the right**.",
    examples: ["move_ball_right()"],
    category: "Movement"
  },
  {
    name: "move_ball_down",
    signature: "move_ball_down()",
    description: "Moves the ball **one unit down** (into the hole).",
    examples: ["move_ball_down()"],
    category: "Movement"
  },
  {
    name: "get_shot_length",
    signature: "get_shot_length()",
    description: "Returns the **length of the shot** — how many units the ball travels to the right.",
    examples: ["set shot_length to get_shot_length()"],
    category: "Game"
  },
  {
    name: "fire_fireworks",
    signature: "fire_fireworks()",
    description: "Fires celebratory fireworks! **Only call this when the ball has landed in the hole.**",
    examples: ["fire_fireworks()"],
    category: "Action"
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
