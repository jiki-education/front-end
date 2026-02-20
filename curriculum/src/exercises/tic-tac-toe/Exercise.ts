import { DrawExercise } from "../../exercise-categories/draw";
import type { ExecutionContext, ExternalFunction, Shared } from "@jiki/interpreters";
import { isNumber, isString } from "@jiki/interpreters";
import metadata from "./metadata.json";

export class TicTacToeExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  // Track write calls for scenario validation
  private writeCalls: string[] = [];

  public get availableFunctions(): ExternalFunction[] {
    const { rectangle, circle, line } = this.getAllAvailableFunctions();
    return [
      rectangle,
      circle,
      line,
      {
        name: "change_stroke",
        func: this.changeStrokeCustom.bind(this),
        description: "set the stroke width to ${arg1} and stroke color to ${arg2}"
      },
      {
        name: "write",
        func: this.writeText.bind(this),
        description: "wrote '${arg1}' to the screen"
      }
    ];
  }

  private changeStrokeCustom(
    _executionCtx: ExecutionContext,
    width: Shared.JikiObject,
    color: Shared.JikiObject
  ): void {
    if (!isNumber(width)) {
      return _executionCtx.logicError("Width must be a number");
    }
    if (!isString(color)) {
      return _executionCtx.logicError("Color must be a string");
    }
    this.strokeWidth = width.value;
    this.strokeColor = color.value;
  }

  private writeText(executionCtx: ExecutionContext, text: Shared.JikiObject): void {
    if (!isString(text)) {
      return executionCtx.logicError("Text must be a string");
    }
    this.writeCalls.push(text.value);

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("overflow", "visible");
    svg.style.opacity = "0";
    svg.id = "svg-" + Math.random().toString(36).slice(2, 11);

    const textElem = document.createElementNS(svgNS, "text");
    textElem.setAttribute("x", "50");
    textElem.setAttribute("y", "55");
    textElem.setAttribute("text-anchor", "middle");
    textElem.setAttribute("dominant-baseline", "middle");
    textElem.setAttribute("fill", "white");
    textElem.setAttribute("font-size", "7");
    textElem.setAttribute("font-weight", "600");
    textElem.textContent = text.value;
    svg.appendChild(textElem);

    this.canvas.appendChild(svg);
    this.animateShapeIntoView(executionCtx, svg);
  }

  // Public validation methods for scenarios
  public wasWriteCalledWith(text: string): boolean {
    return this.writeCalls.includes(text);
  }

  public writeCallCount(): number {
    return this.writeCalls.length;
  }
}

export default TicTacToeExercise;
