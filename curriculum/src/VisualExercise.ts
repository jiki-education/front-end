import type { ExecutionContext, ExternalFunction } from "@jiki/interpreters";
import { jikiscript, javascript, python } from "@jiki/interpreters";
import { Exercise } from "./Exercise";
import type { Language } from "./types";

const interpreters = { jikiscript, javascript, python };

// Base exercise class for visual exercises with animations and state

export abstract class VisualExercise extends Exercise {
  animations: Animation[] = [];
  view!: HTMLElement;
  protected abstract get slug(): string;

  abstract availableFunctions: ExternalFunction[];

  getExternalFunctions(language: Language): ExternalFunction[] {
    return this.availableFunctions.map((f) => ({
      ...f,
      name: interpreters[language].formatIdentifier(f.name)
    }));
  }

  abstract getState(): Record<string, number | string | boolean>;

  constructor() {
    super();
    this.createView();
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

  public addAnimation(animation: Animation) {
    this.animations.push(animation);
  }

  public animateIntoView(executionCtx: ExecutionContext, targets: string, options = { duration: 1, offset: 0 }) {
    this.addAnimation({
      targets,
      duration: options.duration,
      transformations: {
        opacity: 1
      },
      offset: executionCtx.getCurrentTimeInMs() + options.offset
    });
    executionCtx.fastForward(1);
  }

  public animateOutOfView(executionCtx: ExecutionContext, targets: string, options = { duration: 1, offset: 0 }) {
    this.addAnimation({
      targets,
      duration: options.duration,
      transformations: {
        opacity: 0
      },
      offset: executionCtx.getCurrentTimeInMs() + options.offset
    });
    executionCtx.fastForward(1);
  }
}
// Animation type that exercises produce
export interface Animation {
  targets: string; // CSS selector for the element to animate
  offset: number; // Time offset in milliseconds
  duration?: number; // Duration of the animation in milliseconds
  easing?: string; // Easing function name
  transformations: {
    // Subset of anime.js AnimationParams that exercises use
    left?: number | string;
    top?: number | string;
    translateX?: number;
    translateY?: number;
    rotate?: number;
    scale?: number;
    opacity?: number;
    gridRow?: number;
    gridColumn?: number;
  };
}
