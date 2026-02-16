import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class FinishWallExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { rectangle } = this.getAllAvailableFunctions();
    return [rectangle];
  }

  // Setup method for scenarios to set the background image
  public setupBackground(imageUrl: string) {
    this.canvas.style.backgroundImage = `url(${imageUrl})`;
    this.canvas.style.backgroundSize = "cover";
    this.canvas.style.backgroundPosition = "center";
  }

  // Setup stroke styling for visual appearance
  public setupStroke(width: number, color: string) {
    this.strokeWidth = width;
    this.strokeColor = color;
  }
}

export default FinishWallExercise;
