import { type ExecutionContext, type Shared, isNumber } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";
import metadata from "./metadata.json";

export default class StockMarketExercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
  }

  balanceChecked = false;
  reportedBalance: number | undefined;

  private balanceContainer!: HTMLElement;

  constructor() {
    super();
    this.populateView();
  }

  private check_balance(executionCtx: ExecutionContext, amount: Shared.JikiObject) {
    if (!isNumber(amount)) {
      return executionCtx.logicError("Balance must be a number");
    }
    this.reportedBalance = amount.value;
    this.balanceChecked = true;

    const balanceEl = document.createElement("div");
    balanceEl.className = "balance-result";
    balanceEl.textContent = `Final balance: $${amount.value}`;
    balanceEl.style.opacity = "0";
    this.balanceContainer.appendChild(balanceEl);

    this.animateIntoView(executionCtx, `#${this.view.id} .balance-result`);
  }

  protected populateView() {
    this.balanceContainer = document.createElement("div");
    this.balanceContainer.className = "balance-container";
    this.view.appendChild(this.balanceContainer);
  }

  availableFunctions = [
    {
      name: "check_balance",
      func: this.check_balance.bind(this),
      description: "checked the balance: $${arg1}",
      arity: 1 as const
    }
  ];

  getState() {
    return {
      balanceChecked: this.balanceChecked,
      reportedBalance: this.reportedBalance ?? 0
    };
  }
}
