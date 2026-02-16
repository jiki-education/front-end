import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class FoxyFaceExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { rectangle, triangle } = this.getAllAvailableFunctions();
    return [rectangle, triangle];
  }
}

export default FoxyFaceExercise;
