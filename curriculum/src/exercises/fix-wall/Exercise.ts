import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class FixWallExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { rectangle, fill_color_hex } = this.getAllAvailableFunctions();
    return [rectangle, fill_color_hex];
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
    this.strokeColor = { type: "hex", color };
  }
}

export default FixWallExercise;
