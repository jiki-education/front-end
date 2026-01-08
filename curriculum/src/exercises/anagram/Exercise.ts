import { IOExercise } from "../../IOExercise";
import metadata from "./metadata.json";

export default class AnagramExercise extends IOExercise {
  static slug = metadata.slug;

  // Functions are provided by the level's stdlib (push, concatenate, sort_string)
  static availableFunctions = [];
}
