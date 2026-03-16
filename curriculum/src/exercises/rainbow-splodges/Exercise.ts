import { DrawExercise, hexToHsl } from "../../exercise-categories/draw";
import { Circle } from "../../exercise-categories/draw/shapes";
import metadata from "./metadata.json";

export class RainbowSplodgesExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { circle, hsl } = this.getAllAvailableFunctions();
    return [circle, hsl];
  }

  private get circles(): Circle[] {
    return this.shapes.filter((s): s is Circle => s instanceof Circle);
  }

  public checkAllRadiiInRange(min: number, max: number): boolean {
    return this.circles.length > 0 && this.circles.every((c) => c.radius >= min && c.radius < max);
  }

  public checkCirclesTouchEdges(): boolean {
    return (
      this.circles.some((c) => c.cx - c.radius <= 0 || c.cx + c.radius >= 100) &&
      this.circles.some((c) => c.cy - c.radius <= 0 || c.cy + c.radius >= 100)
    );
  }

  public checkSaturationAndLuminosityInRange(min: number, max: number): boolean {
    if (this.circles.length === 0) return false;
    return this.circles.every((c) => {
      const { s, l } = hexToHsl(c.fillColor);
      return s >= min - 1 && s <= max + 1 && l >= min - 1 && l <= max + 1;
    });
  }
}

export default RainbowSplodgesExercise;
