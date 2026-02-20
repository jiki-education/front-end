import { VisualExercise } from "../../VisualExercise";
import { aToR, rToA } from "./utils";
import * as Shapes from "./shapes";
import type { ExecutionContext, InterpretResult } from "@jiki/interpreters";
import type { Shared } from "@jiki/interpreters";
import { isNumber, isString } from "@jiki/interpreters";
import {
  checkCanvasCoverage,
  checkUniqueColoredLines,
  checkUniqueColoredCircles,
  checkUniqueColoredRectangles,
  checkUniquePositionedCircles
} from "./checks";
import type { Shape } from "./shapes";
import { Circle, Line, Rectangle, Triangle, Ellipse } from "./shapes";
import { getCircleAt, getLineAt, getEllipseAt, getRectangleAt, getTriangleAt } from "./retrievers";

export abstract class DrawExercise extends VisualExercise {
  declare protected canvas: HTMLDivElement;
  declare protected tooltip: HTMLDivElement;
  protected shapes: Shape[] = [];
  private visibleShapes: Shape[] = [];

  protected strokeColor: string = "#333333";
  protected strokeWidth = 0;

  constructor() {
    super();
    this.populateView();
  }

  protected createView() {
    super.createView();
    // Add the generic exercise-draw class for CSS styling
    this.view.classList.add("exercise-draw");
  }

  protected populateView() {
    Object.assign(this.view.style, {
      display: "none",
      position: "relative"
    });

    this.canvas = document.createElement("div");
    this.canvas.classList.add("canvas");
    this.canvas.style.position = "relative";
    this.view.appendChild(this.canvas);

    this.tooltip = document.createElement("div");
    this.tooltip.classList.add("tooltip");
    Object.assign(this.tooltip.style, {
      whiteSpace: "nowrap",
      position: "absolute",
      background: "#333",
      color: "#fff",
      padding: "4px",
      borderRadius: "4px",
      fontSize: "12px",
      zIndex: "99999",
      pointerEvents: "none",
      display: "none"
    });
    this.view.appendChild(this.tooltip);

    this.canvas.addEventListener("mousemove", this.showTooltip.bind(this));
    this.canvas.addEventListener("mouseleave", this.hideTooltip.bind(this));
    this.setBackgroundImage = this.setBackgroundImage.bind(this);
  }

  showTooltip(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;

    const absX = event.clientX - rect.left;
    const absY = event.clientY - rect.top;

    const relX = Math.round(aToR(absX, canvasWidth));
    const relY = Math.round(aToR(absY, canvasHeight));

    let tooltipX = absX + 10;
    let tooltipY = absY + 10;

    // providing these as constant values saves us from recalculating them every time
    // update these values if the tooltip style changes
    // measure max tooltip width/height with the fn below
    const maxTooltipWidth = 75;
    const maxTooltipHeight = 32;
    // handle tooltip overflow-x
    if (tooltipX + maxTooltipWidth + 5 > canvasWidth) {
      tooltipX = absX - maxTooltipWidth - 10;
    }

    // handle tooltip overflow-y
    if (tooltipY + maxTooltipHeight + 5 > canvasHeight) {
      tooltipY = absY - maxTooltipHeight - 10;
    }

    this.tooltip.textContent = `X: ${relX}, Y: ${relY}`;
    this.tooltip.style.left = `${tooltipX}px`;
    this.tooltip.style.top = `${tooltipY}px`;
    this.tooltip.style.display = "block";
  }

  hideTooltip() {
    this.tooltip.style.display = "none";
  }

  public getState() {
    return {};
  }
  public numElements(): number {
    return this.shapes.length;
  }
  public hasLineAt(x1: number, y1: number, x2: number, y2: number): boolean {
    return getLineAt(this.shapes, x1, y1, x2, y2) !== undefined;
  }
  public hasRectangleAt(x: number, y: number, width: number, height: number): boolean {
    return getRectangleAt(this.shapes, x, y, width, height) !== undefined;
  }
  public hasCircleAt(cx: number, cy: number, radius: number): boolean {
    return getCircleAt(this.shapes, cx, cy, radius) !== undefined;
  }
  public hasEllipseAt(x: number, y: number, rx: number, ry: number): boolean {
    return getEllipseAt(this.shapes, x, y, rx, ry) !== undefined;
  }
  public hasTriangleAt(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): boolean {
    return getTriangleAt(this.shapes, x1, y1, x2, y2, x3, y3) !== undefined;
  }

  // These all delegate to checks.
  public checkUniqueColoredLines(count: number) {
    return checkUniqueColoredLines(this.shapes, count);
  }

  public checkUniqueColoredRectangles(count: number) {
    return checkUniqueColoredRectangles(this.shapes, count);
  }

  public checkUniqueColoredCircles(count: number) {
    return checkUniqueColoredCircles(this.shapes, count);
  }

  public checkUniquePositionedCircles(count: number) {
    return checkUniquePositionedCircles(this.shapes, count);
  }

  public checkCanvasCoverage(requiredPercentage: number) {
    return checkCanvasCoverage(this.shapes, requiredPercentage);
  }

  public assertAllArgumentsAreVariables(interpreterResult: InterpretResult) {
    return interpreterResult.assertors.assertAllArgumentsAreVariables();
  }
  public setStrokeWidth(_: ExecutionContext, width: Shared.Number) {
    this.strokeWidth = width.value;
  }
  public changeStrokeWidth(_: ExecutionContext, width: number) {
    this.strokeWidth = width;
  }

  public hslToHex(executionCtx: ExecutionContext, h: Shared.JikiObject, s: Shared.JikiObject, l: Shared.JikiObject) {
    if (!isNumber(h) || !isNumber(s) || !isNumber(l)) {
      return executionCtx.logicError("All inputs must be numbers");
    }
    if (h.value < 0 || h.value > 360) {
      return executionCtx.logicError("Hue must be between 0 and 360");
    }
    if (s.value < 0 || s.value > 100) {
      return executionCtx.logicError("Saturation must be between 0 and 100");
    }
    if (l.value < 0 || l.value > 100) {
      return executionCtx.logicError("Luminosity must be between 0 and 100");
    }
    return hslToHexString(h.value, s.value, l.value);
  }

  public rgbToHex(executionCtx: ExecutionContext, r: Shared.JikiObject, g: Shared.JikiObject, b: Shared.JikiObject) {
    if (!isNumber(r) || !isNumber(g) || !isNumber(b)) {
      return executionCtx.logicError("All inputs must be numbers");
    }
    if (r.value < 0 || r.value > 255) {
      return executionCtx.logicError("Red must be between 0 and 255");
    }
    if (g.value < 0 || g.value > 255) {
      return executionCtx.logicError("Green must be between 0 and 255");
    }
    if (b.value < 0 || b.value > 255) {
      return executionCtx.logicError("Blue must be between 0 and 255");
    }
    return rgbToHexString(r.value, g.value, b.value);
  }

  public rectangle(
    executionCtx: ExecutionContext,
    x: Shared.JikiObject,
    y: Shared.JikiObject,
    width: Shared.JikiObject,
    height: Shared.JikiObject,
    color: Shared.JikiObject
  ): void {
    if (!isNumber(x) || !isNumber(y) || !isNumber(width) || !isNumber(height)) {
      return executionCtx.logicError("All inputs must be numbers");
    }
    if (!isString(color)) {
      return executionCtx.logicError("Color must be a string");
    }
    if (width.value <= 0) {
      return executionCtx.logicError("Width must be greater than 0");
    }
    if (height.value <= 0) {
      return executionCtx.logicError("Height must be greater than 0");
    }
    const fillColor = color.value;
    const [absX, absY, absWidth, absHeight] = [x.value, y.value, width.value, height.value].map((val) => rToA(val));

    const elem = Shapes.rect(absX, absY, absWidth, absHeight, this.strokeColor, this.strokeWidth, fillColor);
    this.canvas.appendChild(elem);

    const rect = new Rectangle(x.value, y.value, width.value, height.value, this.strokeColor, fillColor, elem);
    this.shapes.push(rect);
    this.visibleShapes.push(rect);
    this.animateShapeIntoView(executionCtx, elem);
  }
  public line(
    executionCtx: ExecutionContext,
    x1: Shared.JikiObject,
    y1: Shared.JikiObject,
    x2: Shared.JikiObject,
    y2: Shared.JikiObject,
    color: Shared.JikiObject
  ): void {
    if (!isNumber(x1) || !isNumber(y1) || !isNumber(x2) || !isNumber(y2)) {
      return executionCtx.logicError("All inputs must be numbers");
    }
    if (!isString(color)) {
      return executionCtx.logicError("Color must be a string");
    }
    const fillColor = color.value;
    const [absX1, absY1, absX2, absY2] = [x1.value, y1.value, x2.value, y2.value].map((val) => rToA(val));

    const elem = Shapes.line(absX1, absY1, absX2, absY2, this.strokeColor, this.strokeWidth, fillColor);
    this.canvas.appendChild(elem);

    const l = new Line(x1.value, y1.value, x2.value, y2.value, this.strokeColor, fillColor, elem);
    this.shapes.push(l);
    this.visibleShapes.push(l);
    this.animateShapeIntoView(executionCtx, elem);
  }

  public circle(
    executionCtx: ExecutionContext,
    x: Shared.JikiObject,
    y: Shared.JikiObject,
    radius: Shared.JikiObject,
    color: Shared.JikiObject
  ): void {
    if (!isNumber(x) || !isNumber(y) || !isNumber(radius)) {
      return executionCtx.logicError("All inputs must be numbers");
    }
    if (!isString(color)) {
      return executionCtx.logicError("Color must be a string");
    }
    const fillColor = color.value;
    const [absX, absY, absRadius] = [x.value, y.value, radius.value].map((val) => rToA(val));

    const elem = Shapes.circle(absX, absY, absRadius, this.strokeColor, this.strokeWidth, fillColor);
    this.canvas.appendChild(elem);

    const c = new Circle(x.value, y.value, radius.value, this.strokeColor, fillColor, elem);
    this.shapes.push(c);
    this.visibleShapes.push(c);
    this.animateShapeIntoView(executionCtx, elem);
  }

  public ellipse(
    executionCtx: ExecutionContext,
    x: Shared.JikiObject,
    y: Shared.JikiObject,
    rx: Shared.JikiObject,
    ry: Shared.JikiObject,
    color: Shared.JikiObject
  ): void {
    if (!isNumber(x) || !isNumber(y) || !isNumber(rx) || !isNumber(ry)) {
      return executionCtx.logicError("All inputs must be numbers");
    }
    if (!isString(color)) {
      return executionCtx.logicError("Color must be a string");
    }
    const fillColor = color.value;
    const [absX, absY, absRx, absRy] = [x.value, y.value, rx.value, ry.value].map((val) => rToA(val));

    const elem = Shapes.ellipse(absX, absY, absRx, absRy, this.strokeColor, this.strokeWidth, fillColor);
    this.canvas.appendChild(elem);

    const e = new Ellipse(x.value, y.value, rx.value, ry.value, this.strokeColor, fillColor, elem);
    this.shapes.push(e);
    this.visibleShapes.push(e);
    this.animateShapeIntoView(executionCtx, elem);
  }

  public triangle(
    executionCtx: ExecutionContext,
    x1: Shared.JikiObject,
    y1: Shared.JikiObject,
    x2: Shared.JikiObject,
    y2: Shared.JikiObject,
    x3: Shared.JikiObject,
    y3: Shared.JikiObject,
    color: Shared.JikiObject
  ): void {
    if (!isNumber(x1) || !isNumber(y1) || !isNumber(x2) || !isNumber(y2) || !isNumber(x3) || !isNumber(y3)) {
      return executionCtx.logicError("All inputs must be numbers");
    }
    if (!isString(color)) {
      return executionCtx.logicError("Color must be a string");
    }
    const fillColor = color.value;
    const [absX1, absY1, absX2, absY2, absX3, absY3] = [x1.value, y1.value, x2.value, y2.value, x3.value, y3.value].map(
      (val) => rToA(val)
    );

    const elem = Shapes.triangle(
      absX1,
      absY1,
      absX2,
      absY2,
      absX3,
      absY3,
      this.strokeColor,
      this.strokeWidth,
      fillColor
    );
    this.canvas.appendChild(elem);

    const t = new Triangle(
      x1.value,
      y1.value,
      x2.value,
      y2.value,
      x3.value,
      y3.value,
      this.strokeColor,
      fillColor,
      elem
    );
    this.shapes.push(t);
    this.visibleShapes.push(t);
    this.animateShapeIntoView(executionCtx, elem);
  }

  protected animateShapeIntoView(executionCtx: ExecutionContext, elem: SVGElement) {
    this.animateIntoView(executionCtx, `#${this.view.id} #${elem.id}`);
  }
  protected animateShapeOutOfView(executionCtx: ExecutionContext, elem: SVGElement) {
    this.animateOutOfView(executionCtx, `#${this.view.id} #${elem.id}`);
  }

  public clear(executionCtx: ExecutionContext) {
    const duration = 1;
    this.visibleShapes.forEach((shape) => {
      this.addAnimation({
        targets: `#${this.view.id} #${shape.element.id}`,
        duration,
        transformations: {
          opacity: 0
        },
        offset: executionCtx.getCurrentTimeInMs()
      });
    });
    executionCtx.fastForward(duration);

    this.visibleShapes = [];
  }

  public setBackgroundImage(_: ExecutionContext, imageUrl: string | null) {
    if (imageUrl !== null) {
      this.canvas.style.backgroundImage = "url(" + imageUrl + ")";
      this.canvas.style.backgroundSize = "cover";
      this.canvas.style.backgroundPosition = "center";
    } else {
      this.canvas.style.backgroundImage = "none";
    }
  }

  // Static object of all available drawing functions
  // Child classes can select which functions to expose
  protected getAllAvailableFunctions() {
    return {
      rectangle: {
        name: "rectangle",
        func: this.rectangle.bind(this),
        description:
          "drew a rectangle at coordinates (${arg1}, ${arg2}) with a width of ${arg3}, a height of ${arg4}, and a color of ${arg5}"
      },
      triangle: {
        name: "triangle",
        func: this.triangle.bind(this),
        description:
          "drew a triangle with three points: (${arg1}, ${arg2}), (${arg3}, ${arg4}), and (${arg5}, ${arg6}) with a color of ${arg7}"
      },
      circle: {
        name: "circle",
        func: this.circle.bind(this),
        description: "drew a circle with its center at (${arg1}, ${arg2}), a radius of ${arg3}, and a color of ${arg4}"
      },
      ellipse: {
        name: "ellipse",
        func: this.ellipse.bind(this),
        description:
          "drew an ellipse with its center at (${arg1}, ${arg2}), a radial width of ${arg3}, a radial height of ${arg4}, and a color of ${arg5}"
      },
      line: {
        name: "line",
        func: this.line.bind(this),
        description: "drew a line from (${arg1}, ${arg2}) to (${arg3}, ${arg4}) with a color of ${arg5}"
      },
      clear: {
        name: "clear",
        func: this.clear.bind(this),
        description: "cleared the canvas"
      },
      hsl_to_hex: {
        name: "hsl_to_hex",
        func: this.hslToHex.bind(this),
        description: "converted HSL color (hue: ${arg1}, saturation: ${arg2}, luminosity: ${arg3}) to a hex string"
      },
      rgb_to_hex: {
        name: "rgb_to_hex",
        func: this.rgbToHex.bind(this),
        description: "converted RGB color (red: ${arg1}, green: ${arg2}, blue: ${arg3}) to a hex string"
      }
    };
  }
}

function hslToHexString(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHexString(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
