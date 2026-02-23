import { type ExecutionContext, type ExternalFunction } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";
import metadata from "./metadata.json";

export default class NicheNamedPartyExercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
  }

  private personName: string = "";
  private allowedStart: string = "";
  wasLetIn: boolean = false;
  wasTurnedAway: boolean = false;

  private baseImg!: HTMLImageElement;
  private entryImg!: HTMLImageElement;
  private turnedAwayImg!: HTMLImageElement;

  constructor() {
    super();
    this.view.classList.add("exercise-niche-named-party");
    this.populateView();
  }

  availableFunctions: ExternalFunction[] = [
    {
      name: "ask_name",
      func: this.askName.bind(this),
      description: "asked the person their name"
    },
    {
      name: "get_allowed_start",
      func: this.getAllowedStart.bind(this),
      description: "checked tonight's allowed starting letters"
    },
    {
      name: "let_in",
      func: this.letIn.bind(this),
      description: "let the person in"
    },
    {
      name: "turn_away",
      func: this.turnAway.bind(this),
      description: "turned the person away"
    }
  ];

  askName(_executionCtx: ExecutionContext): string {
    return this.personName;
  }

  getAllowedStart(_executionCtx: ExecutionContext): string {
    return this.allowedStart;
  }

  letIn(executionCtx: ExecutionContext) {
    this.wasLetIn = true;
    this.animateIntoView(executionCtx, `#${this.view.id} .entry`);
  }

  turnAway(executionCtx: ExecutionContext) {
    this.wasTurnedAway = true;
    this.animateIntoView(executionCtx, `#${this.view.id} .turned-away`);
  }

  setupName(name: string) {
    this.personName = name;
  }

  setupAllowedStart(prefix: string) {
    this.allowedStart = prefix;
  }

  setupImages(baseUrl: string, entryUrl: string, turnedAwayUrl: string) {
    this.baseImg.src = baseUrl;
    this.entryImg.src = entryUrl;
    this.turnedAwayImg.src = turnedAwayUrl;
  }

  getState() {
    return {
      personName: this.personName,
      allowedStart: this.allowedStart,
      wasLetIn: this.wasLetIn,
      wasTurnedAway: this.wasTurnedAway
    };
  }

  protected populateView() {
    this.view.style.position = "relative";
    this.view.style.width = "100%";
    this.view.style.height = "100%";
    this.view.style.overflow = "hidden";

    this.baseImg = this.createImage("base");
    this.entryImg = this.createImage("entry");
    this.turnedAwayImg = this.createImage("turned-away");
  }

  private createImage(className: string): HTMLImageElement {
    const img = document.createElement("img");
    img.className = className;
    img.style.position = "absolute";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    if (className !== "base") {
      img.style.opacity = "0";
    }
    this.view.appendChild(img);
    return img;
  }
}
