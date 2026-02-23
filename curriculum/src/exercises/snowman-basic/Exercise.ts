import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class SnowmanBasicExercise extends DrawExercise {
  protected fixedColor = "white";

  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { circle } = this.getAllAvailableFunctions();
    return [circle];
  }

  public setupBackground(imageUrl: string) {
    this.canvas.style.backgroundImage = `url(${imageUrl})`;
    this.canvas.style.backgroundSize = "cover";
    this.canvas.style.backgroundPosition = "center";
  }
}

export default SnowmanBasicExercise;
