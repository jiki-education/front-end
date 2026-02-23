import { type ExecutionContext, type Shared, isNumber } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";
import metadata from "./metadata.json";

export default class GoldPanningExercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
  }

  private panQueue: number[] = [];
  private panIndex = 0;
  soldNuggets: number | undefined;
  sold = false;

  private panContainer!: HTMLElement;
  private sellContainer!: HTMLElement;

  constructor() {
    super();
    this.populateView();
  }

  setupPans(values: number[]) {
    this.panQueue = values;
    this.panIndex = 0;
  }

  private pan(executionCtx: ExecutionContext): number {
    if (this.panIndex >= this.panQueue.length) {
      executionCtx.logicError("No more pans available");
      return 0;
    }
    const value = this.panQueue[this.panIndex];
    this.panIndex++;

    const panEl = document.createElement("div");
    panEl.className = "pan-result";
    panEl.textContent = String(value);
    panEl.style.opacity = "0";
    this.panContainer.appendChild(panEl);

    this.animateIntoView(executionCtx, `#${this.view.id} .pan-result:nth-child(${this.panIndex})`);

    return value;
  }

  private sell(executionCtx: ExecutionContext, nuggets: Shared.JikiObject) {
    if (!isNumber(nuggets)) {
      return executionCtx.logicError("You can only sell a number of nuggets");
    }
    this.soldNuggets = nuggets.value;
    this.sold = true;

    const sellEl = document.createElement("div");
    sellEl.className = "sell-result";
    sellEl.textContent = `Sold: ${nuggets.value} nuggets`;
    sellEl.style.opacity = "0";
    this.sellContainer.appendChild(sellEl);

    this.animateIntoView(executionCtx, `#${this.view.id} .sell-result`);
  }

  protected populateView() {
    this.panContainer = document.createElement("div");
    this.panContainer.className = "pan-container";
    this.view.appendChild(this.panContainer);

    this.sellContainer = document.createElement("div");
    this.sellContainer.className = "sell-container";
    this.view.appendChild(this.sellContainer);
  }

  availableFunctions = [
    {
      name: "pan",
      func: this.pan.bind(this),
      description: "panned and found ${return} nuggets",
      arity: 0 as const
    },
    {
      name: "sell",
      func: this.sell.bind(this),
      description: "sold ${arg1} nuggets at the trading post",
      arity: 1 as const
    }
  ];

  getState() {
    return {
      panCount: this.panIndex,
      sold: this.sold,
      soldNuggets: this.soldNuggets ?? 0
    };
  }
}
