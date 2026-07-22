import GolfExercise from "../../exercise-categories/golf/GolfExercise";
import metadata from "./metadata.json";

export default class GolfShotCheckerExercise extends GolfExercise {
  protected get slug() {
    return metadata.slug;
  }

  public availableFunctions = [
    {
      name: "move_to",
      func: this.moveTo.bind(this),
      descriptionKey: "describers.moveTo"
    },
    {
      name: "get_shot_length",
      func: this.getShotLength.bind(this),
      descriptionKey: "describers.getShotLength"
    },
    {
      name: "fire_fireworks",
      func: this.fireFireworks.bind(this),
      descriptionKey: "describers.fireFireworks"
    }
  ];
}
