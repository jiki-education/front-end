import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class BuildWallExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { rectangle } = this.getAllAvailableFunctions();
    return [rectangle];
  }

  // Setup stroke styling for visual appearance
  public setupStroke(width: number, color: string) {
    this.strokeWidth = width;
    this.strokeColor = color;
  }
}

export default BuildWallExercise;
