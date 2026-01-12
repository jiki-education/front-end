import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class PenguinExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  // Select only the drawing functions needed for this exercise
  public get availableFunctions() {
    const { rectangle, circle, ellipse, triangle, fill_color_hex } = this.getAllAvailableFunctions();
    return [rectangle, circle, ellipse, triangle, fill_color_hex];
  }
}

export default PenguinExercise;
