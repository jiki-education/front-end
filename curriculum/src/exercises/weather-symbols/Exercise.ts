import { DrawExercise } from "../../exercise-categories/draw";
import { Circle, Ellipse, Rectangle } from "../../exercise-categories/draw";
import * as Shapes from "../../exercise-categories/draw/shapes";
import metadata from "./metadata.json";
import type { ExecutionContext, Shared } from "@jiki/interpreters";
import { isList, isNumber, isString } from "@jiki/interpreters";

// The forecast is drawn as a 2-wide x 3-tall grid of "day" boxes, filled
// left-to-right then top-to-bottom, so a day's index in the list maps directly
// to its box:  [0][1] / [2][3] / [4][5].
const COLS = 2;
const ROWS = 3;
const BOX_COUNT = COLS * ROWS;
const CELL_W = 100 / COLS;
const CELL_H = 100 / ROWS;
// A small gutter around each box so adjacent sky-blue cells read as distinct tiles.
const MARGIN = 1.5;
// A strip reserved at the top of each box for its weekday label.
const LABEL_STRIP = 7;

const COLORS = {
  sky: "#ADD8E6",
  sun: "#ffed06",
  cloud: "#FFFFFF",
  water: "#56AEFF"
} as const;

const KNOWN_ELEMENTS = ["sun", "cloud", "rain", "snow"];

// Maps a point/length from full-scene space (0-100) into a single box's region,
// scaled uniformly (so circles stay round) and centred within the box.
interface BoxTransform {
  x: (v: number) => number;
  y: (v: number) => number;
  len: (v: number) => number;
}

export class WeatherSymbolsExercise extends DrawExercise {
  // Records the elements drawn into each box, keyed by box index, so scenario
  // expectations can assert what each day shows.
  private boxes: string[][] = [];

  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    return [
      {
        name: "draw",
        func: this.draw.bind(this),
        arity: 3,
        descriptionKey: "describers.draw"
      }
    ];
  }

  public draw(
    executionCtx: ExecutionContext,
    box: Shared.JikiObject,
    day: Shared.JikiObject,
    elements: Shared.JikiObject
  ): void {
    if (!isNumber(box)) {
      return executionCtx.logicError(this.t("errors.indexMustBeNumber"));
    }
    const boxIndex = box.value;
    if (!Number.isInteger(boxIndex) || boxIndex < 0 || boxIndex >= BOX_COUNT) {
      return executionCtx.logicError(this.t("errors.indexOutOfRange", { max: BOX_COUNT - 1 }));
    }
    if (!isString(day)) {
      return executionCtx.logicError(this.t("errors.dayMustBeString"));
    }
    if (!isList(elements)) {
      return executionCtx.logicError(this.t("errors.elementsMustBeList"));
    }

    const symbols: string[] = [];
    for (const element of elements.value) {
      if (!isString(element)) {
        return executionCtx.logicError(this.t("errors.elementsMustBeStrings"));
      }
      if (!KNOWN_ELEMENTS.includes(element.value)) {
        return executionCtx.logicError(this.t("errors.unknownElement", { element: element.value }));
      }
      symbols.push(element.value);
    }

    this.boxes[boxIndex] = symbols;

    const transform = this.boxTransform(boxIndex);
    this.paintSky(executionCtx, boxIndex);
    this.paintLabel(executionCtx, boxIndex, day.value);

    // The sun peeks out small when a cloud shares its box, and fills the box when
    // it's alone. This is purely cosmetic - the student never deals with it.
    const hasCloud = symbols.includes("cloud");
    for (const symbol of symbols) {
      if (symbol === "sun") {
        this.paintSun(executionCtx, transform, hasCloud);
      } else if (symbol === "cloud") {
        this.paintCloud(executionCtx, transform);
      } else if (symbol === "rain") {
        this.paintRain(executionCtx, transform);
      } else if (symbol === "snow") {
        this.paintSnow(executionCtx, transform);
      }
    }
  }

  // Returns true when box `index` shows exactly `expected` (order-independent).
  public hasWeatherAt(index: number, expected: string[]): boolean {
    const actual = this.boxes[index];
    if (actual === undefined) {
      return expected.length === 0;
    }
    if (actual.length !== expected.length) {
      return false;
    }
    const sortedActual = [...actual].sort();
    const sortedExpected = [...expected].sort();
    return sortedActual.every((value, i) => value === sortedExpected[i]);
  }

  private boxTransform(index: number): BoxTransform {
    const col = index % COLS;
    const row = Math.floor(index / COLS);
    const innerW = CELL_W - 2 * MARGIN;
    // The icon sits below the weekday label strip.
    const iconAreaH = CELL_H - 2 * MARGIN - LABEL_STRIP;
    const scale = Math.min(innerW, iconAreaH) / 100;
    const originX = col * CELL_W + MARGIN + (innerW - 100 * scale) / 2;
    const originY = row * CELL_H + MARGIN + LABEL_STRIP + (iconAreaH - 100 * scale) / 2;
    return {
      x: (v) => originX + v * scale,
      y: (v) => originY + v * scale,
      len: (v) => v * scale
    };
  }

  private paintSky(executionCtx: ExecutionContext, index: number): void {
    const col = index % COLS;
    const row = Math.floor(index / COLS);
    this.paintRect(
      executionCtx,
      col * CELL_W + MARGIN,
      row * CELL_H + MARGIN,
      CELL_W - 2 * MARGIN,
      CELL_H - 2 * MARGIN,
      COLORS.sky
    );
  }

  private paintLabel(executionCtx: ExecutionContext, index: number, text: string): void {
    const col = index % COLS;
    const row = Math.floor(index / COLS);
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("overflow", "visible");
    svg.style.opacity = "0";
    svg.id = `label-${this.id}-${index}`;

    const label = document.createElementNS(svgNS, "text");
    label.setAttribute("x", String(col * CELL_W + CELL_W / 2));
    label.setAttribute("y", String(row * CELL_H + MARGIN + 7));
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "4.5");
    label.setAttribute("font-weight", "600");
    label.setAttribute("fill", "#236074");
    label.textContent = text;
    svg.appendChild(label);

    this.canvas.appendChild(svg);
    this.animateShapeIntoView(executionCtx, svg);
  }

  private paintSun(executionCtx: ExecutionContext, t: BoxTransform, small: boolean): void {
    if (small) {
      this.paintCircle(executionCtx, t.x(75), t.y(30), t.len(15), COLORS.sun);
    } else {
      this.paintCircle(executionCtx, t.x(50), t.y(50), t.len(25), COLORS.sun);
    }
  }

  private paintCloud(executionCtx: ExecutionContext, t: BoxTransform): void {
    this.paintRect(executionCtx, t.x(25), t.y(50), t.len(50), t.len(10), COLORS.cloud);
    this.paintCircle(executionCtx, t.x(25), t.y(50), t.len(10), COLORS.cloud);
    this.paintCircle(executionCtx, t.x(40), t.y(40), t.len(15), COLORS.cloud);
    this.paintCircle(executionCtx, t.x(55), t.y(40), t.len(20), COLORS.cloud);
    this.paintCircle(executionCtx, t.x(75), t.y(50), t.len(10), COLORS.cloud);
  }

  private paintRain(executionCtx: ExecutionContext, t: BoxTransform): void {
    const drops = [
      [30, 70],
      [50, 70],
      [70, 70],
      [40, 80],
      [60, 80]
    ];
    for (const [x, y] of drops) {
      this.paintEllipse(executionCtx, t.x(x), t.y(y), t.len(3), t.len(5), COLORS.water);
    }
  }

  private paintSnow(executionCtx: ExecutionContext, t: BoxTransform): void {
    const flakes = [
      [30, 70],
      [50, 70],
      [70, 70],
      [40, 80],
      [60, 80]
    ];
    for (const [x, y] of flakes) {
      this.paintCircle(executionCtx, t.x(x), t.y(y), t.len(5), COLORS.water);
    }
  }

  // Low-level painters. These mirror the base DrawExercise primitives but take
  // already-resolved numbers/hex colours (the student-facing validation and
  // colour resolution isn't needed for our internal rendering).
  private paintRect(
    executionCtx: ExecutionContext,
    x: number,
    y: number,
    width: number,
    height: number,
    color: string
  ): void {
    const elem = Shapes.rect(x, y, width, height, this.strokeColor, this.strokeWidth, color);
    this.canvas.appendChild(elem);
    this.shapes.push(new Rectangle(x, y, width, height, this.strokeColor, color, elem));
    this.animateShapeIntoView(executionCtx, elem);
  }

  private paintCircle(executionCtx: ExecutionContext, cx: number, cy: number, radius: number, color: string): void {
    const elem = Shapes.circle(cx, cy, radius, this.strokeColor, this.strokeWidth, color);
    this.canvas.appendChild(elem);
    this.shapes.push(new Circle(cx, cy, radius, this.strokeColor, color, elem));
    this.animateShapeIntoView(executionCtx, elem);
  }

  private paintEllipse(
    executionCtx: ExecutionContext,
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    color: string
  ): void {
    const elem = Shapes.ellipse(cx, cy, rx, ry, this.strokeColor, this.strokeWidth, color);
    this.canvas.appendChild(elem);
    this.shapes.push(new Ellipse(cx, cy, rx, ry, this.strokeColor, color, elem));
    this.animateShapeIntoView(executionCtx, elem);
  }
}

export default WeatherSymbolsExercise;
