import { IOExercise } from "../../IOExercise";
import metadata from "./metadata.json";

export default class RnaTranscriptionExercise extends IOExercise {
  static slug = metadata.slug;

  // Functions are provided by the level's stdlib (concatenate)
  static availableFunctions = [];
}
