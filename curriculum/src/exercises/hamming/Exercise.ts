import { IOExercise } from "../../IOExercise";
import metadata from "./metadata.json";

export default class HammingExercise extends IOExercise {
  static slug = metadata.slug;
  static availableFunctions = [];
}
