import WordleExercise from "../../exercise-categories/wordle/WordleExercise";
import metadata from "./metadata.json";

export default class ProcessGuessExercise extends WordleExercise {
  protected get slug() {
    return metadata.slug;
  }

  public availableFunctions = [
    {
      name: "color_row",
      func: this.colorRow.bind(this),
      description: "colored a row on the wordle board"
    }
  ];
}
