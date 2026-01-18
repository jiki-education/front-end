import { IOExercise } from "../../IOExercise";
import metadata from "./metadata.json";

export default class NucleotideCountExercise extends IOExercise {
  static slug = metadata.slug;

  // Functions are provided by the level's stdlib (keys)
  static availableFunctions = [];
}
