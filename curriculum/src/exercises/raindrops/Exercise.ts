import { IOExercise } from "../../IOExercise";
import metadata from "./metadata.json";

export default class RaindropsExercise extends IOExercise {
  static slug = metadata.slug;

  // Functions provided by the level's stdlib (concatenate, number_to_string)
  static availableFunctions = [];
}
