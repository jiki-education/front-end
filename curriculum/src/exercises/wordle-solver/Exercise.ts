import WordleExercise from "../../exercise-categories/wordle/WordleExercise";
import metadata from "./metadata.json";

export default class WordleSolverExercise extends WordleExercise {
  protected get slug() {
    return metadata.slug;
  }

  public availableFunctions = [
    {
      name: "add_word",
      func: this.addWord.bind(this),
      description: "added a word to the wordle board"
    },
    {
      name: "get_target_word",
      func: this.getTargetWord.bind(this),
      description: "retrieved the target word"
    },
    {
      name: "common_words",
      func: this.getCommonWords.bind(this),
      description: "retrieved the list of common words"
    }
  ];
}
