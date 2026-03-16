import { type ExecutionContext, type Shared, isNumber } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";
import metadata from "./metadata.json";

const NUGGET_POSITIONS = [
  { top: "32%", left: "16%" },
  { top: "27%", left: "38%" },
  { top: "33%", left: "61%" },
  { top: "46%", left: "32%" },
  { top: "50%", left: "55%" },
  { top: "53%", left: "15%" }
];

export default class GoldPanningExercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
  }

  private panels!: HTMLElement;
  private sellContainer!: HTMLElement;
  private panQueue: number[] = [];
  initialPanValues: number[] = [];
  private panCount = 0;
  soldNuggets: number | undefined;
  sold = false;

  constructor() {
    super();
    this.populateView();
  }

  setupPans(values: number[]) {
    this.panQueue = [...values];
    this.initialPanValues = [...values];
    this.panCount = 0;

    for (let i = 0; i < 5; i++) {
      this.addPanel(i);
    }

    this.addSellPanel();
  }

  setupBackground(imageUrl: string) {
    this.view.style.backgroundImage = `url(${imageUrl})`;
    this.view.style.backgroundSize = "cover";
    this.view.style.backgroundPosition = "center";
  }

  private pan(executionCtx: ExecutionContext): number {
    if (this.sold) {
      executionCtx.logicError("The robot needs to recharge after selling.");
      return 0;
    }

    if (this.panCount >= 5) {
      executionCtx.logicError("The robot needs to go and sell before it does anything else.");
      return 0;
    }

    const value = this.panQueue[this.panCount];
    const panIdx = this.panCount;
    this.panCount++;

    // Reveal this panel's tray
    this.animateIntoView(executionCtx, `#${this.view.id} .panel-${panIdx}`);

    // Show nuggets equal to the returned value
    for (let i = 1; i <= value; i++) {
      this.animateIntoView(executionCtx, `#${this.view.id} .panel-${panIdx} .nugget-${i}`);
    }

    executionCtx.fastForward(200);

    return value;
  }

  private sell(executionCtx: ExecutionContext, nuggets: Shared.JikiObject) {
    if (!isNumber(nuggets)) {
      return executionCtx.logicError("You can only sell a number of nuggets");
    }
    this.soldNuggets = nuggets.value;
    this.sold = true;

    for (let i = 0; i < nuggets.value; i++) {
      this.animateIntoView(executionCtx, `#${this.view.id} .sell-nugget-${i}`);
    }
  }

  private addPanel(idx: number) {
    const result = this.initialPanValues[idx];

    const panel = document.createElement("div");
    panel.className = `panel panel-${idx}`;
    panel.style.position = "relative";
    panel.style.width = "calc(33.333% - 4px)";
    panel.style.aspectRatio = "1";
    panel.style.opacity = "0";
    panel.style.overflow = "hidden";
    panel.style.border = "1px solid #193f7b";
    panel.style.borderRadius = "8px";
    panel.style.boxShadow = "0 0 2px rgba(25, 63, 123, 0.3)";

    const panImg = document.createElement("img");
    panImg.src = "/static/images/exercise-assets/gold-panning/pan.png";
    panImg.className = "pan";
    panImg.style.width = "100%";
    panImg.style.height = "100%";
    panImg.style.objectFit = "contain";
    panImg.style.position = "absolute";
    panImg.style.top = "0";
    panImg.style.left = "0";
    panel.appendChild(panImg);

    for (let i = 0; i < result; i++) {
      const nuggetImg = document.createElement("img");
      nuggetImg.src = `/static/images/exercise-assets/gold-panning/nugget-${i + 1}.png`;
      nuggetImg.className = `nugget nugget-${i + 1}`;
      nuggetImg.style.position = "absolute";
      nuggetImg.style.width = "20%";
      nuggetImg.style.top = NUGGET_POSITIONS[i].top;
      nuggetImg.style.left = NUGGET_POSITIONS[i].left;
      nuggetImg.style.opacity = "0";
      panel.appendChild(nuggetImg);
    }

    this.panels.appendChild(panel);
  }

  private addSellPanel() {
    const total = this.initialPanValues.reduce((sum, v) => sum + v, 0);
    for (let i = 0; i < total; i++) {
      const nuggetImg = document.createElement("img");
      const nuggetNum = (i % 6) + 1;
      nuggetImg.src = `/static/images/exercise-assets/gold-panning/nugget-${nuggetNum}.png`;
      nuggetImg.className = `sell-nugget sell-nugget-${i}`;
      nuggetImg.style.opacity = "0";
      this.sellContainer.appendChild(nuggetImg);
    }
  }

  protected populateView() {
    this.panels = document.createElement("div");
    this.panels.className = "panels";
    this.panels.style.width = "100%";
    this.panels.style.display = "flex";
    this.panels.style.flexWrap = "wrap";
    this.panels.style.justifyContent = "center";
    this.panels.style.gap = "4px";
    this.panels.style.padding = "4px";

    this.view.appendChild(this.panels);

    const style = document.createElement("style");
    style.textContent = `#${this.view.id} { container-type: inline-size; } #${this.view.id} .sell-container img { height: 6cqw; }`;
    this.view.appendChild(style);

    this.sellContainer = document.createElement("div");
    this.sellContainer.className = "sell-container";
    this.sellContainer.style.display = "flex";
    this.sellContainer.style.flexWrap = "wrap";
    this.sellContainer.style.justifyContent = "center";
    this.sellContainer.style.alignItems = "baseline";
    this.sellContainer.style.padding = "4px";
    this.sellContainer.style.gap = "2px";
    this.sellContainer.style.backgroundImage = "url(/static/images/exercise-assets/gold-panning/sell-bg.png)";
    this.sellContainer.style.backgroundSize = "cover";
    this.sellContainer.style.backgroundPosition = "top left";
    this.sellContainer.style.border = "2px solid rgba(25, 63, 123, 0.3)";
    this.sellContainer.style.borderRadius = "8px";
    this.sellContainer.style.margin = "5px 10px";

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
      panCount: this.panCount,
      sold: this.sold,
      soldNuggets: this.soldNuggets ?? 0
    };
  }
}
