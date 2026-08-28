import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class PenguinExercise extends DrawExercise {
  // The student should work the right-hand side out from the symmetry, not read it off.
  protected get coordinateTooltip() {
    return false;
  }

  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { rectangle, circle, ellipse, triangle } = this.getAllAvailableFunctions();
    return [rectangle, circle, ellipse, triangle];
  }
}

export default PenguinExercise;
