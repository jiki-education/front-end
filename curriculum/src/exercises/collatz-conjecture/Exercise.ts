import { IOExercise } from "../../IOExercise";
import metadata from "./metadata.json";

export default class CollatzConjectureExercise extends IOExercise {
  static slug = metadata.slug;

  // No stdlib functions needed - pure math exercise
  static availableFunctions = [];
}
