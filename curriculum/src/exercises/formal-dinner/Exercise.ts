import { IOExercise } from "../../IOExercise";
import metadata from "./metadata.json";

export default class FormalDinnerExercise extends IOExercise {
  static slug = metadata.slug;
  static availableFunctions = [];
}
