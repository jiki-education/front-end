import { type ExecutionContext, type ExternalFunction, type Shared, isString } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";

export type Choice = "rock" | "paper" | "scissors";
export type Result = "player_1" | "player_2" | "tie";

export default abstract class RockPaperScissorsExercise extends VisualExercise {
  private player1Choice?: Choice;
  private player2Choice?: Choice;
  private expectedResult?: Result;
  result: Result | null = null;

  private player1Elem!: HTMLElement;
  private player2Elem!: HTMLElement;

  constructor() {
    super();
    this.view.classList.add("exercise-rock-paper-scissors");
    this.populateView();
  }

  protected populateView() {
    const container = document.createElement("div");
    container.classList.add("players");
    this.view.appendChild(container);

    this.player1Elem = document.createElement("div");
    this.player1Elem.classList.add("player", "player-1");
    container.appendChild(this.player1Elem);

    this.player2Elem = document.createElement("div");
    this.player2Elem.classList.add("player", "player-2");
    container.appendChild(this.player2Elem);
  }

  public setupChoices(player1: Choice, player2: Choice) {
    this.player1Choice = player1;
    this.player2Choice = player2;
    this.expectedResult = this.determineCorrectResult();

    this.player1Elem.classList.add(player1);
    this.player2Elem.classList.add(player2);
    if (this.expectedResult) {
      this.view.classList.add(`result-${this.expectedResult}`);
    }
  }

  private determineCorrectResult(): Result | undefined {
    if (!this.player1Choice || !this.player2Choice) {
      return undefined;
    }

    if (this.player1Choice === this.player2Choice) {
      return "tie";
    }
    if (this.player1Choice === "rock" && this.player2Choice === "scissors") {
      return "player_1";
    }
    if (this.player1Choice === "scissors" && this.player2Choice === "paper") {
      return "player_1";
    }
    if (this.player1Choice === "paper" && this.player2Choice === "rock") {
      return "player_1";
    }

    return "player_2";
  }

  protected getPlayer1Choice(_executionCtx: ExecutionContext): string {
    return this.player1Choice ?? "";
  }

  protected getPlayer2Choice(_executionCtx: ExecutionContext): string {
    return this.player2Choice ?? "";
  }

  protected announceResult(executionCtx: ExecutionContext, result: Shared.JikiObject) {
    if (!isString(result)) {
      return executionCtx.logicError(
        'Oh no! You announced an invalid result. There\'s chaos in the playing hall! Please announce either "player_1", "player_2" or "tie".'
      );
    }

    const resultStr = result.value;
    if (resultStr !== "player_1" && resultStr !== "player_2" && resultStr !== "tie") {
      return executionCtx.logicError(
        'Oh no! You announced an invalid result. There\'s chaos in the playing hall! Please announce either "player_1", "player_2" or "tie".'
      );
    }

    this.result = resultStr;
    if (resultStr !== this.expectedResult) {
      return executionCtx.logicError(
        `Oh no! You announced the wrong result. There's chaos in the playing hall!\n\nYou should have announced \`"${this.expectedResult ?? ""}"\` but you announced \`"${resultStr}"\`.`
      );
    }
  }

  availableFunctions: ExternalFunction[] = [
    {
      name: "announce_result",
      func: this.announceResult.bind(this),
      description: "announced the result of the game as ${arg1}"
    },
    {
      name: "get_player_1_choice",
      func: this.getPlayer1Choice.bind(this),
      description: "returned the choice of player 1"
    },
    {
      name: "get_player_2_choice",
      func: this.getPlayer2Choice.bind(this),
      description: "returned the choice of player 2"
    }
  ];

  getState() {
    return {
      result: this.result ?? ""
    };
  }
}
