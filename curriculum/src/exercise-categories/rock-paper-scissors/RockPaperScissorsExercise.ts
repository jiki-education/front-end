import { type ExecutionContext, type Shared, isString } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";
import type { AvailableFunction } from "../../types";

export type Choice = "rock" | "paper" | "scissors";
export type Result = "Yuki" | "Ando" | "tie";

export default abstract class RockPaperScissorsExercise extends VisualExercise {
  private yukiChoice?: Choice;
  private andoChoice?: Choice;
  private expectedResult?: Result;
  result: Result | null = null;

  private yukiElem!: HTMLElement;
  private andoElem!: HTMLElement;

  constructor() {
    super();
    this.view.classList.add("exercise-rock-paper-scissors");
    this.populateView();
  }

  protected populateView() {
    const container = document.createElement("div");
    container.classList.add("players");
    this.view.appendChild(container);

    this.yukiElem = document.createElement("div");
    this.yukiElem.classList.add("player", "yuki");
    container.appendChild(this.yukiElem);

    this.andoElem = document.createElement("div");
    this.andoElem.classList.add("player", "ando");
    container.appendChild(this.andoElem);
  }

  public setupChoices(yuki: Choice, ando: Choice) {
    this.yukiChoice = yuki;
    this.andoChoice = ando;
    this.expectedResult = this.determineCorrectResult();

    this.yukiElem.classList.add(yuki);
    this.andoElem.classList.add(ando);
    if (this.expectedResult) {
      this.view.classList.add(`result-${this.expectedResult}`);
    }
  }

  private determineCorrectResult(): Result | undefined {
    if (!this.yukiChoice || !this.andoChoice) {
      return undefined;
    }

    if (this.yukiChoice === this.andoChoice) {
      return "tie";
    }
    if (this.yukiChoice === "rock" && this.andoChoice === "scissors") {
      return "Yuki";
    }
    if (this.yukiChoice === "scissors" && this.andoChoice === "paper") {
      return "Yuki";
    }
    if (this.yukiChoice === "paper" && this.andoChoice === "rock") {
      return "Yuki";
    }

    return "Ando";
  }

  protected getYukiChoice(_executionCtx: ExecutionContext): string {
    return this.yukiChoice ?? "";
  }

  protected getAndoChoice(_executionCtx: ExecutionContext): string {
    return this.andoChoice ?? "";
  }

  protected announceResult(executionCtx: ExecutionContext, result: Shared.JikiObject) {
    if (!isString(result)) {
      return executionCtx.logicError(this.t("errors.invalidResult"));
    }

    const resultStr = result.value;
    if (resultStr !== "Yuki" && resultStr !== "Ando" && resultStr !== "tie") {
      return executionCtx.logicError(this.t("errors.invalidResult"));
    }

    this.result = resultStr;
    if (resultStr !== this.expectedResult) {
      return executionCtx.logicError(
        this.t("errors.wrongResult", { expected: this.expectedResult ?? "", got: resultStr })
      );
    }
  }

  availableFunctions: AvailableFunction[] = [
    {
      name: "announce_result",
      func: this.announceResult.bind(this),
      descriptionKey: "describers.announceResult"
    },
    {
      name: "get_yuki_choice",
      func: this.getYukiChoice.bind(this),
      descriptionKey: "describers.getYukiChoice"
    },
    {
      name: "get_ando_choice",
      func: this.getAndoChoice.bind(this),
      descriptionKey: "describers.getAndoChoice"
    }
  ];

  getState() {
    return {
      result: this.result ?? ""
    };
  }
}
