import "./exercise.css";
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { ExerciseDefinition } from "../types";

const exerciseDefinition: ExerciseDefinition = {
  ...metadata, // Spreads all fields from metadata.json
  ExerciseClass,
  tasks,
  scenarios
};

export default exerciseDefinition;
