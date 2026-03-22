import { type ExecutionContext, type ExternalFunction } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";
import metadata from "./metadata.json";

export default class BouncerDressCodeExercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
  }

  private outfit: string = "suit";
  champagneOffered: boolean = false;
  wasLetIn: boolean = false;
  wasTurnedAway: boolean = false;

  private backgroundImg!: HTMLImageElement;
  private resultImg!: HTMLImageElement;

  constructor() {
    super();
    this.view.classList.add("exercise-bouncer-dress-code");
    this.populateView();
  }

  availableFunctions: ExternalFunction[] = [
    {
      name: "get_outfit",
      func: this.getOutfit.bind(this),
      description: "retrieved the person's outfit"
    },
    {
      name: "offer_champagne",
      func: this.offerChampagne.bind(this),
      description: "offered champagne"
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

  getOutfit(_executionCtx: ExecutionContext): string {
    return this.outfit;
  }

  offerChampagne(executionCtx: ExecutionContext) {
    this.champagneOffered = true;
    this.animateIntoView(executionCtx, `#${this.view.id} .result`);
  }

  letIn(executionCtx: ExecutionContext) {
    this.wasLetIn = true;
    this.animateIntoView(executionCtx, `#${this.view.id} .result`);
  }

  turnAway(executionCtx: ExecutionContext) {
    this.wasTurnedAway = true;
    this.animateIntoView(executionCtx, `#${this.view.id} .result`);
  }

  setupOutfit(outfit: string) {
    this.outfit = outfit;
  }

  setupBackground(imageUrl: string) {
    this.backgroundImg.src = imageUrl;
  }

  setupResultImage(imageUrl: string) {
    this.resultImg.src = imageUrl;
  }

  getState() {
    return {
      outfit: this.outfit,
      champagneOffered: this.champagneOffered,
      wasLetIn: this.wasLetIn,
      wasTurnedAway: this.wasTurnedAway
    };
  }

  protected populateView() {
    this.view.style.position = "relative";
    this.view.style.width = "100%";
    this.view.style.height = "100%";
    this.view.style.overflow = "hidden";

    this.backgroundImg = document.createElement("img");
    this.backgroundImg.className = "background";
    this.backgroundImg.style.position = "absolute";
    this.backgroundImg.style.width = "100%";
    this.backgroundImg.style.height = "100%";
    this.backgroundImg.style.objectFit = "cover";
    this.view.appendChild(this.backgroundImg);

    this.resultImg = document.createElement("img");
    this.resultImg.className = "result";
    this.resultImg.style.position = "absolute";
    this.resultImg.style.width = "100%";
    this.resultImg.style.height = "100%";
    this.resultImg.style.objectFit = "cover";
    this.resultImg.style.opacity = "0";
    this.view.appendChild(this.resultImg);
  }
}
