import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class RainbowExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { rectangle, fill_color_hsl } = this.getAllAvailableFunctions();
    return [rectangle, fill_color_hsl];
  }
}

export default RainbowExercise;
