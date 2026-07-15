import { type ExecutionContext, type ExternalFunction, type Shared, isNumber } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";

type CellType = "wall" | "entrance" | "glass";

// Mulberry32 - a simple, fast seeded PRNG (matches interpreters/src/shared/random.ts).
// The width and floors sequences are kept independent so a student's results
// don't depend on the order in which they call randomWidth()/randomNumFloors().
function mulberry32(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Offset applied to the seed for the floors stream so it is independent of the
// width stream. The test suite (scenarios.ts) mirrors this constant.
export const FLOORS_SEED_OFFSET = 0x9e3779b9;

export default class CityScapeExercise extends VisualExercise {
  protected get slug() {
    return "cityscape";
  }

  private readonly COLS = 37;
  private readonly ROWS = 20;

  private grid: Map<string, CellType> = new Map();
  private cellCount = 0;
  private numFloors = 3;
  private numBuildings = 1;
  private gridContainer!: HTMLElement;
  private widthRng?: () => number;
  private floorsRng?: () => number;

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

    if (!Number.isInteger(xVal)) {
      return executionCtx.logicError(
        `You must use whole numbers for \`x\` and \`y\`. You provided \`x\` as \`${xVal}\`, which isn't allowed.`
      );
    }
    if (!Number.isInteger(yVal)) {
      return executionCtx.logicError(
        `You must use whole numbers for \`x\` and \`y\`. You provided \`y\` as \`${yVal}\`, which isn't allowed.`
      );
    }

    if (xVal < 1 || xVal > this.COLS || yVal < 1 || yVal > this.ROWS) {
      return executionCtx.logicError(`Position (${xVal}, ${yVal}) is outside the grid`);
    }

    const existing = this.grid.get(`${xVal},${yVal}`);
    if (existing !== undefined) {
      return executionCtx.logicError(
        `The builders are stuck. There's already a ${existing} at the coordinates \`(${xVal}, ${yVal})\` so they can't build here!`
      );
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
    executionCtx.fastForward(30);
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

  private ensureRngs() {
    if (this.widthRng && this.floorsRng) {
      return;
    }
    // Each quantity draws from its own stream so the Nth call to randomWidth()
    // always returns the Nth building's width, regardless of how it is
    // interleaved with randomNumFloors() calls.
    // Unseeded (free-play) runs alias Math.random for both, which is fine:
    // nothing reconstructs the sequence by position, so call order is irrelevant.
    this.widthRng = this.randomSeed === undefined ? Math.random : mulberry32(this.randomSeed);
    this.floorsRng = this.randomSeed === undefined ? Math.random : mulberry32(this.randomSeed ^ FLOORS_SEED_OFFSET);
  }

  getRandomWidth(_executionCtx: ExecutionContext): number {
    this.ensureRngs();
    // Returns 3, 5, or 7 (odd widths only, so entrance is always centered)
    return Math.floor(this.widthRng!() * 3) * 2 + 3;
  }

  getRandomNumFloors(_executionCtx: ExecutionContext): number {
    this.ensureRngs();
    return Math.floor(this.floorsRng!() * 12) + 1;
  }

  setupNumFloors(n: number) {
    this.numFloors = n;
  }

  setupNumBuildings(n: number) {
    this.numBuildings = n;
  }

  numCols(): number {
    return this.COLS;
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

    // Add concrete floor along the bottom
    const floor = document.createElement("div");
    floor.className = "cell-floor";
    floor.style.gridColumn = `1 / ${this.COLS + 1}`;
    floor.style.gridRow = String(this.ROWS);
    this.gridContainer.appendChild(floor);
  }
}
