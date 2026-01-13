import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class StructuredHouseExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { rectangle, circle, triangle, ellipse, fill_color_hex } = this.getAllAvailableFunctions();
    return [rectangle, circle, triangle, ellipse, fill_color_hex];
  }
}

export default StructuredHouseExercise;
