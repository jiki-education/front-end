import { DrawExercise, hexToHsl } from "../../exercise-categories/draw";
import { Rectangle } from "../../exercise-categories/draw/shapes";
import metadata from "./metadata.json";

export class RainbowExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { rectangle, hsl } = this.getAllAvailableFunctions();
    return [rectangle, hsl];
  }

  public hasRectangleWithHue(targetHue: number, tolerance: number = 10): boolean {
    return this.shapes.some((shape) => {
      if (!(shape instanceof Rectangle)) return false;
      const { h } = hexToHsl(shape.fillColor);
      return Math.abs(h - targetHue) <= tolerance;
    });
  }

  public allRectanglesHaveMinSaturationAndLuminosity(minSat: number, minLum: number): boolean {
    const rects = this.shapes.filter((s) => s instanceof Rectangle);
    if (rects.length === 0) return false;
    return rects.every((shape) => {
      const { s, l } = hexToHsl(shape.fillColor);
      // Allow small tolerance for hex roundtrip precision loss
      return s >= minSat - 1 && l >= minLum - 1;
    });
  }
}

export default RainbowExercise;
