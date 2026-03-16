import { DrawExercise } from "../../exercise-categories/draw";
import { Rectangle } from "../../exercise-categories/draw/shapes";
import metadata from "./metadata.json";

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return { h: 0, s: 0, l: l * 100 };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  return { h: h * 360, s: s * 100, l: l * 100 };
}

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
