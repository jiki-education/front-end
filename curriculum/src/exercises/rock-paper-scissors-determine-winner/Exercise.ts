import { type ExecutionContext, type ExternalFunction, type Shared, isString } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";
import metadata from "./metadata.json";

export default class RockPaperScissorsDetermineWinnerExercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
  }

  private player1Choice: string = "rock";
  private player2Choice: string = "rock";
  result: string | null = null;

  constructor() {
    super();
    this.view.classList.add("exercise-rock-paper-scissors-determine-winner");
  }

  availableFunctions: ExternalFunction[] = [
    {
      name: "get_player_1_choice",
      func: this.getPlayer1Choice.bind(this),
      description: "retrieved player 1's choice"
    },
    {
      name: "get_player_2_choice",
      func: this.getPlayer2Choice.bind(this),
      description: "retrieved player 2's choice"
    },
    {
      name: "announce_result",
      func: this.announceResult.bind(this),
      description: "announced the result"
    }
  ];

  getPlayer1Choice(_executionCtx: ExecutionContext): string {
    return this.player1Choice;
  }

  getPlayer2Choice(_executionCtx: ExecutionContext): string {
    return this.player2Choice;
  }

  announceResult(_executionCtx: ExecutionContext, result: Shared.JikiObject) {
    if (isString(result)) {
      this.result = result.value;
    }
  }

  setupChoices(player1: string, player2: string) {
    this.player1Choice = player1;
    this.player2Choice = player2;
  }

  getState() {
    return {
      result: this.result ?? ""
    };
  }
}
