import { type ExecutionContext, type Shared, isNumber } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";
import metadata from "./metadata.json";

export default class RandomSaladExercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
  }

  saladMade = false;
  saladLeaves: number | undefined;
  saladTomatoes: number | undefined;
  saladCroutons: number | undefined;
  saladDressing: number | undefined;

  private saladContainer!: HTMLElement;

  constructor() {
    super();
    this.populateView();
  }

  private make_salad(
    executionCtx: ExecutionContext,
    leaves: Shared.JikiObject,
    tomatoes: Shared.JikiObject,
    croutons: Shared.JikiObject,
    dressing: Shared.JikiObject
  ) {
    if (!isNumber(leaves)) return executionCtx.logicError("Leaves must be a number");
    if (!isNumber(tomatoes)) return executionCtx.logicError("Tomatoes must be a number");
    if (!isNumber(croutons)) return executionCtx.logicError("Croutons must be a number");
    if (!isNumber(dressing)) return executionCtx.logicError("Dressing must be a number");

    this.saladLeaves = leaves.value;
    this.saladTomatoes = tomatoes.value;
    this.saladCroutons = croutons.value;
    this.saladDressing = dressing.value;
    this.saladMade = true;

    const saladEl = document.createElement("div");
    saladEl.className = "salad-result";
    saladEl.textContent = `Salad: ${leaves.value} leaves, ${tomatoes.value} tomatoes, ${croutons.value} croutons, ${dressing.value} dressing`;
    saladEl.style.opacity = "0";
    this.saladContainer.appendChild(saladEl);

    this.animateIntoView(executionCtx, `#${this.view.id} .salad-result`);
  }

  protected populateView() {
    this.saladContainer = document.createElement("div");
    this.saladContainer.className = "salad-container";
    this.view.appendChild(this.saladContainer);
  }

  availableFunctions = [
    {
      name: "make_salad",
      func: this.make_salad.bind(this),
      description: "made a salad with ${arg1} leaves, ${arg2} tomatoes, ${arg3} croutons, and ${arg4} dressing",
      arity: 4 as const
    }
  ];

  getState() {
    return {
      saladMade: this.saladMade,
      leaves: this.saladLeaves ?? 0,
      tomatoes: this.saladTomatoes ?? 0,
      croutons: this.saladCroutons ?? 0,
      dressing: this.saladDressing ?? 0
    };
  }
}
