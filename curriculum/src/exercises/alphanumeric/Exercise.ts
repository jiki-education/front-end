import { IOExercise } from "../../IOExercise";
import metadata from "./metadata.json";

export default class AlphanumericExercise extends IOExercise {
  static slug = metadata.slug;
  static availableFunctions = [];
}
