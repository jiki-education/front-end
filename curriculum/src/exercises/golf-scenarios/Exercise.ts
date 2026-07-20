import GolfExercise from "../../exercise-categories/golf/GolfExercise";
import metadata from "./metadata.json";

export default class GolfScenariosExercise extends GolfExercise {
  protected get slug() {
    return metadata.slug;
  }

  public availableFunctions = [
    {
      name: "move_to",
      func: this.moveTo.bind(this),
      descriptionKey: "describers.moveTo",
      arity: 1 as const
    },
    {
      name: "get_shot_length",
      func: this.getShotLength.bind(this),
      descriptionKey: "describers.getShotLength"
    }
  ];
}
