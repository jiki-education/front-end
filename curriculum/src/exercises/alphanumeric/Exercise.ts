import { IOExercise } from "../../IOExercise";
import metadata from "./metadata.json";

export default class AlphanumericExercise extends IOExercise {
  protected get slug() {
    return metadata.slug;
  }
  availableFunctions = [];
}
