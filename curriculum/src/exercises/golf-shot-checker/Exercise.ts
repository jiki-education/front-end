import GolfExercise from "../../exercise-categories/golf/GolfExercise";
import metadata from "./metadata.json";

export default class GolfShotCheckerExercise extends GolfExercise {
  protected get slug() {
    return metadata.slug;
  }

  public availableFunctions = [
    {
      name: "roll_to",
      func: this.rollTo.bind(this),
      description: "rolled the ball to position (${arg1}, ${arg2})"
    },
    {
      name: "get_shot_length",
      func: this.getShotLength.bind(this),
      description: "retrieved the shot length"
    },
    {
      name: "fire_fireworks",
      func: this.fireFireworks.bind(this),
      description: "fired off celebratory fireworks"
    }
  ];
}
