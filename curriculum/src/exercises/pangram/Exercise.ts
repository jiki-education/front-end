import { IOExercise } from "../../IOExercise";
import metadata from "./metadata.json";

export default class PangramExercise extends IOExercise {
  static slug = metadata.slug;

  // Functions are provided by the level's stdlib (concatenate, keys)
  static availableFunctions = [];
}
