import { type ExecutionContext, type ExternalFunction, type Shared, isNumber } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";

type CellType = "wall" | "entrance" | "glass";

export default class CityScapeExercise extends VisualExercise {
  protected get slug() {
    return "cityscape";
  }

  private readonly COLS = 30;
  private readonly ROWS = 10;

  private grid: Map<string, CellType> = new Map();
  private cellCount = 0;
  private numFloors = 3;
  private numBuildings = 1;
  private gridContainer!: HTMLElement;

  constructor() {
    super();
    this.view.classList.add("exercise-cityscape");
    this.populateView();
  }

  availableFunctions: ExternalFunction[] = [
    {
      name: "build_wall",
      func: this.buildWall.bind(this),
      description: "built a wall at position (${arg1}, ${arg2})"
    },
    {
      name: "build_entrance",
      func: this.buildEntrance.bind(this),
      description: "built an entrance at position (${arg1}, ${arg2})"
    },
    {
      name: "build_glass",
      func: this.buildGlass.bind(this),
      description: "built a glass panel at position (${arg1}, ${arg2})"
    },
    {
      name: "num_floors",
      func: this.getNumFloors.bind(this),
      description: "retrieved the number of floors"
    },
    {
      name: "num_buildings",
      func: this.getNumBuildings.bind(this),
      description: "retrieved the number of buildings"
    }
  ];

  private buildCell(executionCtx: ExecutionContext, x: Shared.JikiObject, y: Shared.JikiObject, type: CellType) {
    if (!isNumber(x) || !isNumber(y)) {
      return executionCtx.logicError("x and y must be numbers");
    }
    const xVal = x.value;
    const yVal = y.value;

    if (xVal < 1 || xVal > this.COLS || yVal < 1 || yVal > this.ROWS) {
      return executionCtx.logicError(`Position (${xVal}, ${yVal}) is outside the grid`);
    }

    this.grid.set(`${xVal},${yVal}`, type);
    this.cellCount++;

    const cell = document.createElement("div");
    cell.className = `cell cell-${type}`;
    cell.id = `cell-${xVal}-${yVal}`;
    cell.style.gridColumn = String(xVal);
    cell.style.gridRow = String(this.ROWS + 1 - yVal);
    cell.style.opacity = "0";
    this.gridContainer.appendChild(cell);

    this.animateIntoView(executionCtx, `#${this.view.id} #cell-${xVal}-${yVal}`);
  }

  buildWall(executionCtx: ExecutionContext, x: Shared.JikiObject, y: Shared.JikiObject) {
    this.buildCell(executionCtx, x, y, "wall");
  }

  buildEntrance(executionCtx: ExecutionContext, x: Shared.JikiObject, y: Shared.JikiObject) {
    this.buildCell(executionCtx, x, y, "entrance");
  }

  buildGlass(executionCtx: ExecutionContext, x: Shared.JikiObject, y: Shared.JikiObject) {
    this.buildCell(executionCtx, x, y, "glass");
  }

  getNumFloors(_executionCtx: ExecutionContext): number {
    return this.numFloors;
  }

  getNumBuildings(_executionCtx: ExecutionContext): number {
    return this.numBuildings;
  }

  setupNumFloors(n: number) {
    this.numFloors = n;
  }

  setupNumBuildings(n: number) {
    this.numBuildings = n;
  }

  hasCellAt(x: number, y: number, type: CellType): boolean {
    return this.grid.get(`${x},${y}`) === type;
  }

  getCellAt(x: number, y: number): CellType | null {
    return this.grid.get(`${x},${y}`) ?? null;
  }

  totalCells(): number {
    return this.cellCount;
  }

  getState() {
    return {
      totalCells: this.cellCount,
      numFloors: this.numFloors,
      numBuildings: this.numBuildings
    };
  }

  protected populateView() {
    this.gridContainer = document.createElement("div");
    this.gridContainer.className = "cityscape-grid";
    this.view.appendChild(this.gridContainer);
  }
}
