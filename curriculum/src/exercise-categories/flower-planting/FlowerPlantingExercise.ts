import { type ExecutionContext, type ExternalFunction, type Shared, isNumber } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";
import "./exercise.css";

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
    { src: "/static/images/exercise-assets/plant-the-flowers/lily.webp", height: "20%", zIndex: "2" },
    { src: "/static/images/exercise-assets/plant-the-flowers/tulip.webp", height: "25%", zIndex: "2" },
    { src: "/static/images/exercise-assets/plant-the-flowers/sunflower.webp", height: "65%", zIndex: "1" },
    { src: "/static/images/exercise-assets/plant-the-flowers/rose.webp", height: "32%", zIndex: "2" },
    { src: "/static/images/exercise-assets/plant-the-flowers/daffodil.webp", height: "30%", zIndex: "2" },
    { src: "/static/images/exercise-assets/plant-the-flowers/forget-me-not.webp", height: "22%", zIndex: "2" },
    { src: "/static/images/exercise-assets/plant-the-flowers/hyacinth.webp", height: "38%", zIndex: "2" },
    { src: "/static/images/exercise-assets/plant-the-flowers/poppy.webp", height: "18%", zIndex: "2" },
    { src: "/static/images/exercise-assets/plant-the-flowers/lavender.webp", height: "45%", zIndex: "2" },
    { src: "/static/images/exercise-assets/plant-the-flowers/crocus.webp", height: "15%", zIndex: "2" },
    { src: "/static/images/exercise-assets/plant-the-flowers/cherry-blossom.webp", height: "48%", zIndex: "2" }
  ];

  setupBackground(imageUrl: string) {
    this.view.style.backgroundImage = `url(${imageUrl})`;
    this.view.style.backgroundSize = "cover";
    this.view.style.backgroundPosition = "center";
  }

  plant(executionCtx: ExecutionContext, position: Shared.JikiObject) {
    if (!isNumber(position)) {
      return executionCtx.logicError(this.t("errors.positionNumber"));
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
