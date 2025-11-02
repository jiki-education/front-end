import { IOExercise } from "../../Exercise";
import metadata from "./metadata.json";

export default class AcronymExercise extends IOExercise {
  static slug = metadata.slug;

  // Functions are provided by the level's stdlib (concatenate, to_upper_case)
  static availableFunctions = [];
}
