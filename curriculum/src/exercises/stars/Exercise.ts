import { IOExercise } from "../../IOExercise";
import metadata from "./metadata.json";

export default class StarsExercise extends IOExercise {
  static slug = metadata.slug;

  static availableFunctions = [];
}
