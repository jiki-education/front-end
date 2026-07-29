import { DrawExercise } from "../../exercise-categories/draw";
import type { ExecutionContext, Shared } from "@jiki/interpreters";
import { isList, isString } from "@jiki/interpreters";
import type { AvailableFunction } from "../../types";
import metadata from "./metadata.json";

// The pyramid is sized to fill the canvas for the current scenario: a `rows`-high
// pyramid uses cells of 100/rows, so a count of 5 gives ~20%-wide stars and a count
// of 10 gives ~10%. The longest row sits at the BOTTOM and each shorter row stacks
// above it (row 0 = bottom = longest), centred on the canvas midline.
const GAP_RATIO = 0.1; // fraction of a cell left as padding around each star

// One star asset, tinted via `currentColor` (background-color) behind a mask: the
// faint outline uses gray-300, the student's drawn stars use amber-400 ("gold").
const STAR_ASSET = "/static/images/exercise-assets/stars/star.svg";
const STAR_COLOR = "#fbbf24";
const TEMPLATE_COLOR = "#cbd5e1";

export default class StarsExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  // Number of rows the current scenario targets — drives the cell size so the pyramid
  // fills the canvas, and keeps the template and the student's stars on the same grid.
  private rows = 1;

  // Gold stars the student has drawn, tracked by their row-from-the-bottom (0 = bottom).
  private drawnStars: { col: number; rowFromBottom: number }[] = [];

  public availableFunctions: AvailableFunction[] = [
    {
      name: "draw_stars",
      func: this.drawStars.bind(this),
      descriptionKey: "describers.drawStars"
    }
  ];

  // Called from a scenario's `setup` (no ExecutionContext): paints the faint target
  // outline for this count. Template stars are static — never animated and never
  // tracked — so they stay visible from the first frame and don't count towards the
  // student's drawn stars.
  public setupTemplate(count: number) {
    this.rows = Math.max(count, 1);
    for (let rowFromBottom = 0; rowFromBottom < count; rowFromBottom++) {
      const starsInRow = count - rowFromBottom;
      for (let col = 0; col < starsInRow; col++) {
        this.createStar(col, rowFromBottom, starsInRow, TEMPLATE_COLOR, "1");
      }
    }
  }

  // Student-facing: draws one row of gold stars per string in the list, using the
  // string's length as that row's star count. The first string is drawn at the
  // bottom, so a correctly-built descending list fills the outline exactly.
  private drawStars(executionCtx: ExecutionContext, array: Shared.JikiObject): void {
    if (!isList(array)) {
      return executionCtx.logicError(this.t("errors.notAnArray"));
    }
    for (let rowFromBottom = 0; rowFromBottom < array.value.length; rowFromBottom++) {
      const element = array.value[rowFromBottom];
      if (!isString(element)) {
        return executionCtx.logicError(this.t("errors.notStrings"));
      }
      const starsInRow = element.value.length;
      for (let col = 0; col < starsInRow; col++) {
        this.drawStar(executionCtx, col, rowFromBottom, starsInRow);
      }
    }
  }

  private drawStar(executionCtx: ExecutionContext, col: number, rowFromBottom: number, rowWidth: number) {
    const elem = this.createStar(col, rowFromBottom, rowWidth, STAR_COLOR, "0");
    this.drawnStars.push({ col, rowFromBottom });
    this.animateIntoView(executionCtx, `#${this.view.id} #${elem.id}`);
  }

  private createStar(
    col: number,
    rowFromBottom: number,
    rowWidth: number,
    color: string,
    opacity: string
  ): HTMLElement {
    const cell = 100 / this.rows;
    const pad = cell * GAP_RATIO;
    const size = cell - pad * 2;
    const gridRow = this.rows - 1 - rowFromBottom; // 0 = top of the canvas
    // Centre each row on the canvas midline so the rows stack into a symmetric pyramid.
    const rowOffset = (this.rows - rowWidth) / 2;
    const elem = document.createElement("div");
    elem.id = "star-" + Math.random().toString(36).slice(2, 11);
    Object.assign(elem.style, {
      position: "absolute",
      left: `${(rowOffset + col) * cell + pad}%`,
      top: `${gridRow * cell + pad}%`,
      width: `${size}%`,
      height: `${size}%`,
      color: color,
      backgroundColor: "currentColor",
      opacity
    });
    // Mask the star shape out of the coloured background so `currentColor` tints it.
    const mask = `url("${STAR_ASSET}") center / contain no-repeat`;
    elem.style.setProperty("mask", mask);
    elem.style.setProperty("-webkit-mask", mask);
    this.canvas.appendChild(elem);
    return elem;
  }

  // Number of gold stars the student has drawn in a given row (0 = bottom row).
  public countStarsInRow(rowFromBottom: number): number {
    return this.drawnStars.filter((s) => s.rowFromBottom === rowFromBottom).length;
  }

  public totalStars(): number {
    return this.drawnStars.length;
  }
}
