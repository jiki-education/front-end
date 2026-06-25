import { type ExecutionContext, type ExternalFunction } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";
import metadata from "./metadata.json";

export default class AnnalynsInfiltrationExercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
  }

  // Camp state (set up per scenario)
  private knightAwake: boolean = false;
  private archerAwake: boolean = false;
  private prisonerAwake: boolean = false;
  private dogPresent: boolean = false;

  // Actions Annalyn has taken
  didFastAttack: boolean = false;
  didSpy: boolean = false;
  didSignal: boolean = false;
  didFree: boolean = false;

  private knightEl!: HTMLElement;
  private archerEl!: HTMLElement;
  private prisonerEl!: HTMLElement;
  private dogEl!: HTMLElement;

  constructor() {
    super();
    this.view.classList.add("exercise-annalyns-infiltration");
    this.populateView();
  }

  availableFunctions: ExternalFunction[] = [
    {
      name: "knight_is_awake",
      func: this.knightIsAwake.bind(this),
      description: "checked whether the knight is awake"
    },
    {
      name: "archer_is_awake",
      func: this.archerIsAwake.bind(this),
      description: "checked whether the archer is awake"
    },
    {
      name: "prisoner_is_awake",
      func: this.prisonerIsAwake.bind(this),
      description: "checked whether the prisoner is awake"
    },
    {
      name: "has_dog",
      func: this.hasDog.bind(this),
      description: "checked whether Annalyn has her dog with her"
    },
    {
      name: "fast_attack",
      func: this.fastAttack.bind(this),
      description: "made a fast attack on the knight"
    },
    {
      name: "spy",
      func: this.spy.bind(this),
      description: "spied on the group"
    },
    {
      name: "signal_prisoner",
      func: this.signalPrisoner.bind(this),
      description: "signalled the prisoner"
    },
    {
      name: "free_prisoner",
      func: this.freePrisoner.bind(this),
      description: "freed the prisoner"
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

  hasDog(_executionCtx: ExecutionContext): boolean {
    return this.dogPresent;
  }

  // Action functions
  fastAttack(executionCtx: ExecutionContext) {
    this.didFastAttack = true;
    this.animateIntoView(executionCtx, `#${this.view.id} .action-fast-attack`);
  }

  spy(executionCtx: ExecutionContext) {
    this.didSpy = true;
    this.animateIntoView(executionCtx, `#${this.view.id} .action-spy`);
  }

  signalPrisoner(executionCtx: ExecutionContext) {
    this.didSignal = true;
    this.animateIntoView(executionCtx, `#${this.view.id} .action-signal`);
  }

  freePrisoner(executionCtx: ExecutionContext) {
    this.didFree = true;
    this.animateIntoView(executionCtx, `#${this.view.id} .action-free`);
  }

  setupCamp(knightAwake: boolean, archerAwake: boolean, prisonerAwake: boolean, dogPresent: boolean) {
    this.knightAwake = knightAwake;
    this.archerAwake = archerAwake;
    this.prisonerAwake = prisonerAwake;
    this.dogPresent = dogPresent;

    this.renderCharacter(this.knightEl, "🛡️", "Knight", knightAwake);
    this.renderCharacter(this.archerEl, "🏹", "Archer", archerAwake);
    this.renderCharacter(this.prisonerEl, "🧑", "Prisoner", prisonerAwake);
    this.dogEl.style.opacity = dogPresent ? "1" : "0.15";
  }

  private renderCharacter(el: HTMLElement, emoji: string, label: string, awake: boolean) {
    el.innerHTML = `<div class="emoji">${emoji}</div><div class="label">${label}</div><div class="status">${
      awake ? "Awake" : "Asleep 💤"
    }</div>`;
  }

  getState() {
    return {
      knightAwake: this.knightAwake,
      archerAwake: this.archerAwake,
      prisonerAwake: this.prisonerAwake,
      dogPresent: this.dogPresent,
      didFastAttack: this.didFastAttack,
      didSpy: this.didSpy,
      didSignal: this.didSignal,
      didFree: this.didFree
    };
  }

  protected populateView() {
    this.view.style.position = "relative";
    this.view.style.width = "100%";
    this.view.style.height = "100%";
    this.view.style.display = "flex";
    this.view.style.flexDirection = "column";
    this.view.style.justifyContent = "space-around";
    this.view.style.alignItems = "center";
    this.view.style.fontFamily = "sans-serif";
    this.view.style.background = "#1f2933";
    this.view.style.color = "#fff";

    // The camp: knight, archer, prisoner, and Annalyn (+ dog)
    const camp = document.createElement("div");
    camp.className = "camp";
    camp.style.display = "flex";
    camp.style.gap = "24px";
    camp.style.fontSize = "18px";
    camp.style.textAlign = "center";

    this.knightEl = document.createElement("div");
    this.archerEl = document.createElement("div");
    this.prisonerEl = document.createElement("div");
    this.dogEl = document.createElement("div");
    this.dogEl.innerHTML = `<div class="emoji">🐕</div><div class="label">Dog</div>`;

    camp.appendChild(this.knightEl);
    camp.appendChild(this.archerEl);
    camp.appendChild(this.prisonerEl);
    camp.appendChild(this.dogEl);
    this.view.appendChild(camp);

    // Action banners, hidden until Annalyn performs them
    const actions = document.createElement("div");
    actions.className = "actions";
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
    el.style.background = "#3e4c59";
    el.style.fontWeight = "bold";
    return el;
  }
}
