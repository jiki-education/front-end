import { type ExecutionContext, type ExternalFunction } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";
import metadata from "./metadata.json";

export default class BouncerWristbandsExercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
  }

  private age: number = 30;
  wristband: string | null = null;

  private baseImg!: HTMLImageElement;
  private childImg!: HTMLImageElement;
  private teenImg!: HTMLImageElement;
  private adultImg!: HTMLImageElement;
  private seniorImg!: HTMLImageElement;

  constructor() {
    super();
    this.view.classList.add("exercise-bouncer-wristbands");
    this.populateView();
  }

  availableFunctions: ExternalFunction[] = [
    {
      name: "get_age",
      func: this.getAge.bind(this),
      description: "retrieved the person's age"
    },
    {
      name: "child_wristband",
      func: this.childWristband.bind(this),
      description: "gave a child wristband"
    },
    {
      name: "teen_wristband",
      func: this.teenWristband.bind(this),
      description: "gave a teen wristband"
    },
    {
      name: "adult_wristband",
      func: this.adultWristband.bind(this),
      description: "gave an adult wristband"
    },
    {
      name: "senior_wristband",
      func: this.seniorWristband.bind(this),
      description: "gave a senior wristband"
    }
  ];

  getAge(_executionCtx: ExecutionContext): number {
    return this.age;
  }

  childWristband(executionCtx: ExecutionContext) {
    this.wristband = "child";
    this.animateIntoView(executionCtx, `#${this.view.id} .wristband-child`);
  }

  teenWristband(executionCtx: ExecutionContext) {
    this.wristband = "teen";
    this.animateIntoView(executionCtx, `#${this.view.id} .wristband-teen`);
  }

  adultWristband(executionCtx: ExecutionContext) {
    this.wristband = "adult";
    this.animateIntoView(executionCtx, `#${this.view.id} .wristband-adult`);
  }

  seniorWristband(executionCtx: ExecutionContext) {
    this.wristband = "senior";
    this.animateIntoView(executionCtx, `#${this.view.id} .wristband-senior`);
  }

  setupAge(age: number) {
    this.age = age;
  }

  setupImages(baseUrl: string, childUrl: string, teenUrl: string, adultUrl: string, seniorUrl: string) {
    this.baseImg.src = baseUrl;
    this.childImg.src = childUrl;
    this.teenImg.src = teenUrl;
    this.adultImg.src = adultUrl;
    this.seniorImg.src = seniorUrl;
  }

  getState() {
    return {
      age: this.age,
      wristband: this.wristband ?? ""
    };
  }

  protected populateView() {
    this.view.style.position = "relative";
    this.view.style.width = "100%";
    this.view.style.height = "100%";
    this.view.style.overflow = "hidden";

    this.baseImg = this.createImage("base");
    this.childImg = this.createImage("wristband-child");
    this.teenImg = this.createImage("wristband-teen");
    this.adultImg = this.createImage("wristband-adult");
    this.seniorImg = this.createImage("wristband-senior");
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
