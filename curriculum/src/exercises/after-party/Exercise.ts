import { IOExercise } from "../../IOExercise";
import metadata from "./metadata.json";

export default class AfterPartyExercise extends IOExercise {
  static slug = metadata.slug;

  // No stdlib functions needed - students implement their own helpers
  static availableFunctions = [];
}
