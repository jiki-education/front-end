import type { ExecutionContext } from "@jiki/interpreters";

// Animation type that exercises produce
export interface Animation {
  targets: string; // CSS selector for the element to animate
  offset: number; // Time offset in milliseconds
  duration?: number; // Duration of the animation in milliseconds
  easing?: string; // Easing function name
  transformations: {
    // Subset of anime.js AnimationParams that exercises use
    left?: number;
    top?: number;
    translateX?: number;
    translateY?: number;
    rotate?: number;
    scale?: number;
    opacity?: number;
    gridRow?: number;
    gridColumn?: number;
  };
}

// Base exercise class that all curriculum exercises extend
export abstract class Exercise {
  animations: Animation[] = [];
  view!: HTMLElement;
  protected abstract get slug(): string;

  abstract availableFunctions: Array<{
    name: string;
    func: (ctx: ExecutionContext) => void;
    description?: string;
  }>;

  abstract getState(): Record<string, number | string | boolean>;

  constructor() {
    this.createView();
    this.populateView();
  }

  protected createView() {
    const cssClass = `exercise-${this.slug}`;
    this.view = document.createElement("div");
    this.view.id = `${cssClass}-${Math.random().toString(36).substr(2, 9)}`;
    this.view.classList.add(cssClass);
    this.view.style.display = "none";
    document.body.appendChild(this.view);
  }

  protected populateView() {}

  getView(): HTMLElement {
    return this.view;
  }
}
