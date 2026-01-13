import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";
import type { ExecutionContext } from "@jiki/interpreters";
import { jikiscript, type Shared } from "@jiki/interpreters";

export class RainbowBallExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { circle, fill_color_hsl } = this.getAllAvailableFunctions();
    return [circle, fill_color_hsl, this.getRandomNumberFunction()];
  }

  private getRandomNumberFunction() {
    return {
      name: "random_number",
      func: this.randomNumber.bind(this),
      description: "returned a random number between ${arg1} and ${arg2}"
    };
  }

  private randomNumber(_: ExecutionContext, min: Shared.Number, max: Shared.Number): jikiscript.Number {
    // Handle inverted ranges like random_number(-1, -5)
    const minVal = Math.min(min.value, max.value);
    const maxVal = Math.max(min.value, max.value);
    const result = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
    return new jikiscript.Number(result);
  }
}

export default RainbowBallExercise;
