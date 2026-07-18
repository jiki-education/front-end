import WordleExercise from "../../exercise-categories/wordle/WordleExercise";
import metadata from "./metadata.json";

export default class ProcessGameExercise extends WordleExercise {
  protected get slug() {
    return metadata.slug;
  }

  public availableFunctions = [
    {
      name: "color_row",
      func: this.colorRow.bind(this),
      descriptionKey: "describers.colorRow"
    }
  ];
}
