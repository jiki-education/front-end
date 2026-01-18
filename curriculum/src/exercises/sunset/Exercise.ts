import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class SunsetExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { circle, rectangle, fill_color_rgb, fill_color_hsl, fill_color_hex } = this.getAllAvailableFunctions();
    return [circle, rectangle, fill_color_rgb, fill_color_hsl, fill_color_hex];
  }
}

export default SunsetExercise;
