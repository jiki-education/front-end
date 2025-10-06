import "./exercise.css";
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { ExerciseDefinition } from "../types";
import jikiscriptSolution from "./solution.jiki?raw";
import javascriptSolution from "./solution.js?raw";
import pythonSolution from "./solution.py?raw";

const exerciseDefinition: ExerciseDefinition = {
  ...metadata, // Spreads all fields from metadata.json
  ExerciseClass,
  tasks,
  scenarios,
  solutions: {
    jikiscript: jikiscriptSolution,
    javascript: javascriptSolution,
    python: pythonSolution
  }
};

export default exerciseDefinition;
