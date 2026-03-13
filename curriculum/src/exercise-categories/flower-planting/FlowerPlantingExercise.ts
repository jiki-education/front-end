import { type ExecutionContext, type ExternalFunction, type Shared, isNumber } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";

export default abstract class FlowerPlantingExercise extends VisualExercise {
  abstract availableFunctions: ExternalFunction[];
  protected get slug() {
    return "flower-planting";
  }

  constructor() {
    super();
    this.view.classList.add("exercise-plant-the-flowers");
  }

  flowers: number[] = [];
  private plantCallCount = 0;

  private static readonly flowerImages: { src: string; height: string; zIndex: string }[] = [
    { src: "/static/images/exercise-assets/plant-the-flowers/lily.png", height: "20%", zIndex: "2" },
    { src: "/static/images/exercise-assets/plant-the-flowers/tulip.png", height: "25%", zIndex: "2" },
    { src: "/static/images/exercise-assets/plant-the-flowers/sunflower.png", height: "65%", zIndex: "1" },
    { src: "/static/images/exercise-assets/plant-the-flowers/rose.png", height: "32%", zIndex: "2" },
    { src: "/static/images/exercise-assets/plant-the-flowers/daffodil.png", height: "30%", zIndex: "2" },
    { src: "/static/images/exercise-assets/plant-the-flowers/forget-me-not.png", height: "22%", zIndex: "2" },
    { src: "/static/images/exercise-assets/plant-the-flowers/hyacinth.png", height: "38%", zIndex: "2" },
    { src: "/static/images/exercise-assets/plant-the-flowers/poppy.png", height: "18%", zIndex: "2" },
    { src: "/static/images/exercise-assets/plant-the-flowers/lavender.png", height: "45%", zIndex: "2" },
    { src: "/static/images/exercise-assets/plant-the-flowers/crocus.png", height: "15%", zIndex: "2" },
    { src: "/static/images/exercise-assets/plant-the-flowers/cherry-blossom.png", height: "48%", zIndex: "2" }
  ];

  setupBackground(imageUrl: string) {
    this.view.style.backgroundImage = `url(${imageUrl})`;
    this.view.style.backgroundSize = "cover";
    this.view.style.backgroundPosition = "center";
  }

  plant(executionCtx: ExecutionContext, position: Shared.JikiObject) {
    if (!isNumber(position)) {
      return executionCtx.logicError("Position must be a number");
    }

    this.flowers.push(position.value);

    const flowerInfo = FlowerPlantingExercise.flowerImages[this.plantCallCount % 11];
    this.plantCallCount++;

    const img = document.createElement("img");
    img.src = flowerInfo.src;
    img.className = "flower";
    img.style.position = "absolute";
    img.style.left = `${position.value}%`;
    img.style.bottom = "18%";
    img.style.width = "auto";
    img.style.height = "0";
    img.style.transform = "translateX(-50%)";
    img.style.zIndex = flowerInfo.zIndex;
    this.view.appendChild(img);

    const target = `#${this.view.id} .flower:nth-child(${this.flowers.length})`;
    this.addAnimation({
      targets: target,
      duration: 500,
      offset: executionCtx.getCurrentTimeInMs(),
      transformations: {
        height: flowerInfo.height
      }
    });
    executionCtx.fastForward(700);
  }

  hasFlowerAt(position: number): boolean {
    return this.flowers.includes(position);
  }

  getState() {
    return {
      flowerCount: this.flowers.length
    };
  }
}
