import { DrawExercise } from "../DrawExercise";
import metadata from "./metadata.json";

export class SproutingFlowerExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  // Select only the drawing functions needed for this exercise
  public get availableFunctions() {
    const { rectangle, circle, ellipse, fill_color_hex } = this.getAllAvailableFunctions();
    return [rectangle, circle, ellipse, fill_color_hex];
  }
}
