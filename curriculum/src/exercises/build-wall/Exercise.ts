import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class BuildWallExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { rectangle, fill_color_hex } = this.getAllAvailableFunctions();
    return [rectangle, fill_color_hex];
  }

  // Setup stroke styling for visual appearance
  public setupStroke(width: number, color: string) {
    this.strokeWidth = width;
    this.strokeColor = { type: "hex", color };
  }
}

export default BuildWallExercise;
