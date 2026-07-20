import { IOExercise } from "../../IOExercise";
import metadata from "./metadata.json";

export default class CollatzConjectureExercise extends IOExercise {
  protected get slug() {
    return metadata.slug;
  }

  // No stdlib functions needed - pure math exercise
  availableFunctions = [];
}
