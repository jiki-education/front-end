import { type ExecutionContext, type Shared, isNumber } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";
import metadata from "./metadata.json";

const LEAF_IMAGES = [
  "/static/images/exercise-assets/random-salad/leaf-1.png",
  "/static/images/exercise-assets/random-salad/leaf-2.png",
  "/static/images/exercise-assets/random-salad/leaf-3.png",
  "/static/images/exercise-assets/random-salad/leaf-4.png"
];

const CROUTON_IMAGES = [
  "/static/images/exercise-assets/random-salad/crouton-1.png",
  "/static/images/exercise-assets/random-salad/crouton-2.png",
  "/static/images/exercise-assets/random-salad/crouton-3.png",
  "/static/images/exercise-assets/random-salad/crouton-4.png",
  "/static/images/exercise-assets/random-salad/crouton-5.png",
  "/static/images/exercise-assets/random-salad/crouton-6.png"
];

const TOMATO_IMAGES = [
  "/static/images/exercise-assets/random-salad/tomato-1.png",
  "/static/images/exercise-assets/random-salad/tomato-2.png"
];

const OLIVE_SLICE_IMAGES = [
  "/static/images/exercise-assets/random-salad/olive-slice-1.png",
  "/static/images/exercise-assets/random-salad/olive-slice-2.png"
];

export default class RandomSaladExercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
  }

  saladMade = false;
  saladLeaves: number | undefined;
  saladTomatoes: number | undefined;
  saladCroutons: number | undefined;
  saladOlives: number | undefined;

  private saladContainer!: HTMLElement;
  private ingredientIndex = 0;

  constructor() {
    super();
    this.populateView();
  }

  public setupBackground(imageUrl: string) {
    this.view.style.backgroundImage = `url(${imageUrl})`;
    this.view.style.backgroundSize = "90%";
    this.view.style.backgroundPosition = "center";
    this.view.style.backgroundRepeat = "no-repeat";
  }

  private placeIngredient(
    executionCtx: ExecutionContext,
    src: string,
    opts: { minWidth: number; maxWidth: number; minTop: number; maxTop: number; minLeft: number; maxLeft: number }
  ) {
    const id = `ingredient-${this.ingredientIndex++}`;
    const el = document.createElement("img");
    el.id = id;
    el.src = src;
    el.style.position = "absolute";
    el.style.opacity = "0";

    const width = opts.minWidth + Math.random() * (opts.maxWidth - opts.minWidth);
    el.style.width = `${width}%`;
    el.style.height = "auto";

    const yPos = opts.minTop + Math.random() * (opts.maxTop - opts.minTop);
    if (Math.random() < 0.5) {
      el.style.top = `${yPos}%`;
    } else {
      el.style.bottom = `${yPos}%`;
    }

    const xPos = opts.minLeft + Math.random() * (opts.maxLeft - opts.minLeft);
    if (Math.random() < 0.5) {
      el.style.left = `${xPos}%`;
    } else {
      el.style.right = `${xPos}%`;
    }

    const rotation = Math.random() * 360;
    el.style.transform = `rotate(${rotation}deg)`;

    this.saladContainer.appendChild(el);

    this.animateIntoView(executionCtx, `#${this.view.id} #${id}`);
  }

  private make_salad(
    executionCtx: ExecutionContext,
    leaves: Shared.JikiObject,
    tomatoes: Shared.JikiObject,
    croutons: Shared.JikiObject,
    olives: Shared.JikiObject
  ) {
    if (!isNumber(leaves)) return executionCtx.logicError("Leaves must be a number");
    if (!isNumber(tomatoes)) return executionCtx.logicError("Tomatoes must be a number");
    if (!isNumber(croutons)) return executionCtx.logicError("Croutons must be a number");
    if (!isNumber(olives)) return executionCtx.logicError("Olives must be a number");

    this.saladLeaves = leaves.value;
    this.saladTomatoes = tomatoes.value;
    this.saladCroutons = croutons.value;
    this.saladOlives = olives.value;
    this.saladMade = true;

    // Draw half the leaves first as a base layer
    const halfLeaves = Math.floor(leaves.value / 2);
    for (let i = 0; i < halfLeaves; i++) {
      const src = LEAF_IMAGES[Math.floor(Math.random() * LEAF_IMAGES.length)];
      this.placeIngredient(executionCtx, src, {
        minWidth: 20,
        maxWidth: 35,
        minTop: 20,
        maxTop: 50,
        minLeft: 20,
        maxLeft: 50
      });
    }

    // Shuffle remaining leaves with tomatoes, croutons and olives
    const items: Array<"leaf" | "tomato" | "crouton" | "olive"> = [];
    for (let i = 0; i < leaves.value - halfLeaves; i++) items.push("leaf");
    for (let i = 0; i < tomatoes.value; i++) items.push("tomato");
    for (let i = 0; i < croutons.value; i++) items.push("crouton");
    for (let i = 0; i < olives.value; i++) items.push("olive");

    // Fisher-Yates shuffle
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }

    for (const item of items) {
      if (item === "leaf") {
        const src = LEAF_IMAGES[Math.floor(Math.random() * LEAF_IMAGES.length)];
        this.placeIngredient(executionCtx, src, {
          minWidth: 20,
          maxWidth: 35,
          minTop: 20,
          maxTop: 50,
          minLeft: 20,
          maxLeft: 50
        });
      } else if (item === "tomato") {
        const src = TOMATO_IMAGES[Math.floor(Math.random() * TOMATO_IMAGES.length)];
        this.placeIngredient(executionCtx, src, {
          minWidth: 18,
          maxWidth: 24,
          minTop: 15,
          maxTop: 55,
          minLeft: 15,
          maxLeft: 55
        });
      } else if (item === "crouton") {
        const src = CROUTON_IMAGES[Math.floor(Math.random() * CROUTON_IMAGES.length)];
        this.placeIngredient(executionCtx, src, {
          minWidth: 6,
          maxWidth: 10,
          minTop: 25,
          maxTop: 50,
          minLeft: 25,
          maxLeft: 50
        });
      } else {
        const src = OLIVE_SLICE_IMAGES[Math.floor(Math.random() * OLIVE_SLICE_IMAGES.length)];
        for (let s = 0; s < 6; s++) {
          this.placeIngredient(executionCtx, src, {
            minWidth: 5,
            maxWidth: 7,
            minTop: 20,
            maxTop: 55,
            minLeft: 20,
            maxLeft: 55
          });
        }
      }
    }
  }

  protected populateView() {
    this.saladContainer = document.createElement("div");
    this.saladContainer.className = "salad-container";
    this.saladContainer.style.position = "relative";
    this.saladContainer.style.width = "100%";
    this.saladContainer.style.height = "100%";
    this.view.appendChild(this.saladContainer);
  }

  availableFunctions = [
    {
      name: "make_salad",
      func: this.make_salad.bind(this),
      description: "made a salad with ${arg1} leaves, ${arg2} tomatoes, ${arg3} croutons, and ${arg4} olives",
      arity: 4 as const
    }
  ];

  getState() {
    return {
      saladMade: this.saladMade,
      leaves: this.saladLeaves ?? 0,
      tomatoes: this.saladTomatoes ?? 0,
      croutons: this.saladCroutons ?? 0,
      olives: this.saladOlives ?? 0
    };
  }
}
