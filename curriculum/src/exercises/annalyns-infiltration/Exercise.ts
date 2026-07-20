import { type ExecutionContext } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";
import type { AvailableFunction } from "../../types";
import metadata from "./metadata.json";

export default class AnnalynsInfiltrationExercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
  }

  // Camp state (set up per scenario)
  private knightAwake: boolean = false;
  private archerAwake: boolean = false;
  private prisonerAwake: boolean = false;
  private dogBehaving: boolean = false;

  // Number of times Annalyn has taken each action
  fastAttackCount: number = 0;
  spyCount: number = 0;
  signalCount: number = 0;
  freeCount: number = 0;

  private backgroundImg!: HTMLImageElement;

  constructor() {
    super();
    this.view.classList.add("exercise-annalyns-infiltration");
    this.populateView();
  }

  availableFunctions: AvailableFunction[] = [
    {
      name: "knight_is_awake",
      func: this.knightIsAwake.bind(this),
      descriptionKey: "describers.knightIsAwake"
    },
    {
      name: "archer_is_awake",
      func: this.archerIsAwake.bind(this),
      descriptionKey: "describers.archerIsAwake"
    },
    {
      name: "prisoner_is_awake",
      func: this.prisonerIsAwake.bind(this),
      descriptionKey: "describers.prisonerIsAwake"
    },
    {
      name: "dog_is_behaving",
      func: this.dogIsBehaving.bind(this),
      descriptionKey: "describers.dogIsBehaving"
    },
    {
      name: "fast_attack",
      func: this.fastAttack.bind(this),
      descriptionKey: "describers.fastAttack"
    },
    {
      name: "spy",
      func: this.spy.bind(this),
      descriptionKey: "describers.spy"
    },
    {
      name: "signal_prisoner",
      func: this.signalPrisoner.bind(this),
      descriptionKey: "describers.signalPrisoner"
    },
    {
      name: "free_prisoner",
      func: this.freePrisoner.bind(this),
      descriptionKey: "describers.freePrisoner"
    }
  ];

  // Information functions (return raw booleans)
  knightIsAwake(_executionCtx: ExecutionContext): boolean {
    return this.knightAwake;
  }

  archerIsAwake(_executionCtx: ExecutionContext): boolean {
    return this.archerAwake;
  }

  prisonerIsAwake(_executionCtx: ExecutionContext): boolean {
    return this.prisonerAwake;
  }

  dogIsBehaving(_executionCtx: ExecutionContext): boolean {
    return this.dogBehaving;
  }

  // Action functions
  fastAttack(executionCtx: ExecutionContext) {
    this.fastAttackCount += 1;
    this.animateIntoView(executionCtx, `#${this.view.id} .action-fast-attack`);
  }

  spy(executionCtx: ExecutionContext) {
    this.spyCount += 1;
    this.animateIntoView(executionCtx, `#${this.view.id} .action-spy`);
  }

  signalPrisoner(executionCtx: ExecutionContext) {
    this.signalCount += 1;
    this.animateIntoView(executionCtx, `#${this.view.id} .action-signal`);
  }

  freePrisoner(executionCtx: ExecutionContext) {
    this.freeCount += 1;
    this.animateIntoView(executionCtx, `#${this.view.id} .action-free`);
  }

  setupCamp(knightAwake: boolean, archerAwake: boolean, prisonerAwake: boolean, dogBehaving: boolean) {
    this.knightAwake = knightAwake;
    this.archerAwake = archerAwake;
    this.prisonerAwake = prisonerAwake;
    this.dogBehaving = dogBehaving;
  }

  setupBackground(imageUrl: string) {
    this.backgroundImg.src = imageUrl;
  }

  getState() {
    return {
      knightAwake: this.knightAwake,
      archerAwake: this.archerAwake,
      prisonerAwake: this.prisonerAwake,
      dogBehaving: this.dogBehaving,
      fastAttackCount: this.fastAttackCount,
      spyCount: this.spyCount,
      signalCount: this.signalCount,
      freeCount: this.freeCount
    };
  }

  protected populateView() {
    this.view.style.position = "relative";
    this.view.style.width = "100%";
    this.view.style.height = "100%";
    this.view.style.overflow = "hidden";
    this.view.style.fontFamily = "sans-serif";

    // Scene image depicting the camp state (set per scenario via setupBackground)
    this.backgroundImg = document.createElement("img");
    this.backgroundImg.className = "background";
    this.backgroundImg.style.position = "absolute";
    this.backgroundImg.style.width = "100%";
    this.backgroundImg.style.height = "100%";
    this.backgroundImg.style.objectFit = "cover";
    this.view.appendChild(this.backgroundImg);

    // Action banners, overlaid at the bottom, hidden until Annalyn performs them
    const actions = document.createElement("div");
    actions.className = "actions";
    actions.style.position = "absolute";
    actions.style.bottom = "12px";
    actions.style.left = "0";
    actions.style.right = "0";
    actions.style.display = "flex";
    actions.style.gap = "12px";
    actions.style.flexWrap = "wrap";
    actions.style.justifyContent = "center";

    actions.appendChild(this.createActionBanner("action-fast-attack", "⚔️ Fast attack!"));
    actions.appendChild(this.createActionBanner("action-spy", "🔭 Spying..."));
    actions.appendChild(this.createActionBanner("action-signal", "🐦 Signalling the prisoner"));
    actions.appendChild(this.createActionBanner("action-free", "🔓 Freeing the prisoner!"));
    this.view.appendChild(actions);
  }

  private createActionBanner(className: string, text: string): HTMLElement {
    const el = document.createElement("div");
    el.className = className;
    el.textContent = text;
    el.style.opacity = "0";
    el.style.padding = "8px 14px";
    el.style.borderRadius = "6px";
    el.style.background = "rgba(31, 41, 51, 0.85)";
    el.style.color = "#fff";
    el.style.fontWeight = "bold";
    return el;
  }
}
