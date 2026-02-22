import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class PenguinExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { rectangle, circle, ellipse, triangle } = this.getAllAvailableFunctions();
    return [rectangle, circle, ellipse, triangle];
  }
}

export default PenguinExercise;
