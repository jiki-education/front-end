import { DrawExercise } from "../../exercise-categories/draw";
import { getCircleAt } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class TrafficLightsExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { circle } = this.getAllAvailableFunctions();
    return [circle];
  }

  public hasCircleWithColorAt(cx: number, cy: number, radius: number, fillColor: string): boolean {
    const circle = getCircleAt(this.shapes, cx, cy, radius);
    return circle !== undefined && circle.fillColor === fillColor;
  }

  public setupBackground(imageUrl: string) {
    this.canvas.style.backgroundImage = `url(${imageUrl})`;
    this.canvas.style.backgroundSize = "cover";
    this.canvas.style.backgroundPosition = "center";
  }
}

export default TrafficLightsExercise;
