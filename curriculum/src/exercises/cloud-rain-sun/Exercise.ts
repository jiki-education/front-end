import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class CloudRainSunExercise extends DrawExercise {
  protected coordinateGrid = 5;
  // The raindrops deliberately use a horizontal radius of 3.
  protected gridExemptFunctions = ["ellipse"];

  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { rectangle, circle, ellipse } = this.getAllAvailableFunctions();
    return [rectangle, circle, ellipse];
  }

  public setupBackground(imageUrl: string) {
    this.canvas.style.backgroundImage = `url(${imageUrl})`;
    this.canvas.style.backgroundSize = "cover";
    this.canvas.style.backgroundPosition = "center";
  }
}

export default CloudRainSunExercise;
