import { type ExecutionContext, type ExternalFunction } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";
import metadata from "./metadata.json";

export default class BouncerExercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
  }

  private age: number = 21;
  hasLetIn: boolean = false;

  private backgroundImg!: HTMLImageElement;
  private letInImg!: HTMLImageElement;

  constructor() {
    super();
    this.view.classList.add("exercise-bouncer");
    this.populateView();
  }

  availableFunctions: ExternalFunction[] = [
    {
      name: "ask_age",
      func: this.askAge.bind(this),
      description: "asked the person's age"
    },
    {
      name: "let_in",
      func: this.letIn.bind(this),
      description: "let the person in"
    }
  ];

  askAge(_executionCtx: ExecutionContext): number {
    return this.age;
  }

  letIn(executionCtx: ExecutionContext) {
    this.hasLetIn = true;
    this.animateIntoView(executionCtx, `#${this.view.id} .let-in`);
  }

  setupAge(age: number) {
    this.age = age;
  }

  setupBackground(imageUrl: string) {
    this.backgroundImg.src = imageUrl;
  }

  setupLetInImage(imageUrl: string) {
    this.letInImg.src = imageUrl;
  }

  getState() {
    return {
      age: this.age,
      hasLetIn: this.hasLetIn
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

    this.letInImg = document.createElement("img");
    this.letInImg.className = "let-in";
    this.letInImg.style.position = "absolute";
    this.letInImg.style.width = "100%";
    this.letInImg.style.height = "100%";
    this.letInImg.style.objectFit = "cover";
    this.letInImg.style.opacity = "0";
    this.view.appendChild(this.letInImg);
  }
}
