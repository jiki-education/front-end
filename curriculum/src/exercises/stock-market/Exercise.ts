import { type ExecutionContext, type Shared, isNumber } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";
import metadata from "./metadata.json";

const GRAPH_LEFT = 12;
const GRAPH_RIGHT = 95;
const GRAPH_TOP = 8;
const GRAPH_BOTTOM = 82;

export default class StockMarketExercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
  }

  initialGrowthRates: Record<number, number> = {};
  startYear = 0;
  private growthRates: Record<number, number> = {};
  taxReports: { year: number; balance: number }[] = [];
  announcedBalance: number | undefined;
  private yearIndex = 0;
  private moneyValues: number[] = [];

  constructor() {
    super();
    this.populateView();
  }

  setupGrowthRates(startYear: number, rates: Record<number, number>) {
    this.startYear = startYear;
    this.initialGrowthRates = { ...rates };
    this.growthRates = { ...rates };

    this.moneyValues = [10];
    let money = 10;
    for (let year = startYear; year < startYear + 20; year++) {
      money = (money * (100 + rates[year])) / 100;
      this.moneyValues.push(money);
    }

    this.buildGraph();
  }

  private buildGraph() {
    const graphArea = this.view.querySelector(".graph-area") as HTMLElement;
    graphArea.innerHTML = "";

    const startingMoney = this.moneyValues[0];
    const moneyToPct = (money: number) => ((money - startingMoney) / startingMoney) * 100;

    // Calculate Y scale rounded to nearest 50
    const pctValues = this.moneyValues.map(moneyToPct);
    const yMin = Math.floor(Math.min(...pctValues) / 50) * 50;
    const yMax = Math.ceil(Math.max(...pctValues) / 50) * 50;

    const xPos = (i: number) => GRAPH_LEFT + (i / 20) * (GRAPH_RIGHT - GRAPH_LEFT);
    const yPos = (pct: number) => {
      const ratio = (pct - yMin) / (yMax - yMin);
      return GRAPH_BOTTOM - ratio * (GRAPH_BOTTOM - GRAPH_TOP);
    };

    // Axes
    const yAxis = document.createElement("div");
    yAxis.className = "axis axis-y";
    graphArea.appendChild(yAxis);

    const xAxis = document.createElement("div");
    xAxis.className = "axis axis-x";
    graphArea.appendChild(xAxis);

    // Y-axis labels and grid lines
    for (let pct = yMin; pct <= yMax; pct += 50) {
      const y = yPos(pct);

      const label = document.createElement("div");
      label.className = "axis-label axis-label-y";
      label.style.top = `${y}%`;
      label.textContent = `${pct}%`;
      graphArea.appendChild(label);

      const gridLine = document.createElement("div");
      gridLine.className = "grid-line";
      gridLine.style.top = `${y}%`;
      graphArea.appendChild(gridLine);
    }

    // X-axis labels
    for (let i = 0; i <= 20; i += 5) {
      const label = document.createElement("div");
      label.className = "axis-label axis-label-x";
      label.style.left = `${xPos(i)}%`;
      label.textContent = `${this.startYear + i}`;
      graphArea.appendChild(label);
    }

    // Starting dot (0% growth)
    const startDot = document.createElement("div");
    startDot.className = "graph-dot graph-dot-start";
    startDot.style.left = `${xPos(0)}%`;
    startDot.style.top = `${yPos(0)}%`;
    graphArea.appendChild(startDot);

    // Line segments and dots for each year
    for (let i = 0; i < 20; i++) {
      const x1 = xPos(i);
      const y1 = yPos(moneyToPct(this.moneyValues[i]));
      const x2 = xPos(i + 1);
      const y2 = yPos(moneyToPct(this.moneyValues[i + 1]));

      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      const line = document.createElement("div");
      line.className = `graph-line graph-line-${i}`;
      line.style.left = `${x1}%`;
      line.style.top = `${y1}%`;
      line.style.width = `${length}%`;
      line.style.transform = `rotate(${angle}deg)`;
      graphArea.appendChild(line);

      const dot = document.createElement("div");
      dot.className = `graph-dot graph-dot-${i}`;
      dot.style.left = `${x2}%`;
      dot.style.top = `${y2}%`;
      graphArea.appendChild(dot);
    }

    // Money value display (animated via innerHTML)
    const valueEl = document.createElement("div");
    valueEl.className = "money-value";
    valueEl.innerHTML = this.moneyValues[0].toFixed(2);
    graphArea.appendChild(valueEl);
  }

  private market_growth(executionCtx: ExecutionContext, year: Shared.JikiObject): number {
    if (!isNumber(year)) {
      return executionCtx.logicError("Year must be a number");
    }
    const y = year.value;
    if (y < this.startYear) {
      return executionCtx.logicError(`We can't check the stock market for old years! ${y} is in the past.`);
    }
    if (y >= this.startYear + 20) {
      return executionCtx.logicError(`We don't know about more than 20 years from now! ${y} is too far in the future.`);
    }
    const rate = this.growthRates[y];

    const idx = this.yearIndex;
    this.yearIndex++;

    this.animateIntoView(executionCtx, `#${this.view.id} .graph-line-${idx}`);
    this.animateIntoView(executionCtx, `#${this.view.id} .graph-dot-${idx}`);

    this.addAnimation({
      targets: `#${this.view.id} .money-value`,
      offset: executionCtx.getCurrentTimeInMs(),
      duration: 200,
      easing: "linear",
      modifier: (v: number) => v.toFixed(2),
      transformations: {
        innerHTML: Math.round(this.moneyValues[idx + 1] * 100) / 100
      }
    });

    executionCtx.fastForward(200);

    return rate;
  }

  private report_tax(executionCtx: ExecutionContext, year: Shared.JikiObject, balance: Shared.JikiObject) {
    if (!isNumber(year)) {
      return executionCtx.logicError("Year must be a number");
    }
    if (!isNumber(balance)) {
      return executionCtx.logicError("Balance must be a number");
    }
    this.taxReports.push({ year: year.value, balance: balance.value });
  }

  private announce_to_family(executionCtx: ExecutionContext, money: Shared.JikiObject) {
    if (!isNumber(money)) {
      return executionCtx.logicError("Money must be a number");
    }
    this.announcedBalance = money.value;
  }

  protected populateView() {
    const graphArea = document.createElement("div");
    graphArea.className = "graph-area";
    this.view.appendChild(graphArea);
  }

  availableFunctions = [
    {
      name: "market_growth",
      func: this.market_growth.bind(this),
      description: "got market growth of ${return}% for year ${arg1}",
      arity: 1 as const
    },
    {
      name: "report_tax",
      func: this.report_tax.bind(this),
      description: "reported tax for year ${arg1}: $${arg2}",
      arity: 2 as const
    },
    {
      name: "announce_to_family",
      func: this.announce_to_family.bind(this),
      description: "announced $${arg1} to the family",
      arity: 1 as const
    }
  ];

  getState() {
    return {
      taxReportsCount: this.taxReports.length,
      announcedBalance: this.announcedBalance ?? 0
    };
  }
}
