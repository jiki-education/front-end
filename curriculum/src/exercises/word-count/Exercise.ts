import { IOExercise } from "../../IOExercise";
import metadata from "./metadata.json";

export default class WordCountExercise extends IOExercise {
  static slug = metadata.slug;

  // Functions are provided by the level's stdlib (concatenate, push, has_key, to_lower_case)
  static availableFunctions = [];
}
