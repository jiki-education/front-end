import { IOExercise } from "../../IOExercise";
import metadata from "./metadata.json";

export default class ExtractWordsExercise extends IOExercise {
  static slug = metadata.slug;

  // Functions are provided by the level's stdlib (concatenate, push)
  static availableFunctions = [];
}
