import { IOExercise } from "../../IOExercise";
import metadata from "./metadata.json";

export default class TileSearchExercise extends IOExercise {
  protected get slug() {
    return metadata.slug;
  }
  availableFunctions = [];
}
