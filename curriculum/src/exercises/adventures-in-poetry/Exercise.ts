import { type ExecutionContext, type Shared, isString } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";
import metadata from "./metadata.json";

// Anything the poet can find on a square. A word is any other string.
export const FLAG = "🏁";
const EMOJI_PATTERN = /\p{Extended_Pictographic}/u;

export default class AdventuresInPoetryExercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
  }

  private track: string[] = [];
  private stepWidth = 0;
  private position = -1;
  public recitedPoem: string | undefined;
  public recited = false;

  constructor() {
    super();
    this.populateView();
  }

  setupTrack(track: string[]) {
    this.track = [...track];
    // One extra step so the poet has somewhere to stand before the first square.
    this.stepWidth = 100 / (this.track.length + 1);

    this.track.forEach((content, index) => this.addSquare(index, content));
  }

  private move(executionCtx: ExecutionContext): string {
    if (this.position >= this.track.length - 1) {
      executionCtx.logicError(this.t("errors.endOfPath"));
      return "";
    }

    this.position += 1;
    const content = this.track[this.position];

    this.addAnimation({
      targets: `#${this.view.id} .poet`,
      offset: executionCtx.getCurrentTimeInMs(),
      duration: 200,
      transformations: { left: `${(this.position + 1) * this.stepWidth}%` }
    });

    // Alternate the two frames so the poet's legs move as they walk. A hard cut
    // rather than a fade, or the two frames ghost through each other.
    const showsSecondFrame = this.position % 2 === 0;
    this.addAnimation({
      targets: `#${this.view.id} .poet-frame-1`,
      offset: executionCtx.getCurrentTimeInMs(),
      duration: 1,
      transformations: { opacity: showsSecondFrame ? 0 : 1 }
    });
    this.addAnimation({
      targets: `#${this.view.id} .poet-frame-2`,
      offset: executionCtx.getCurrentTimeInMs(),
      duration: 1,
      transformations: { opacity: showsSecondFrame ? 1 : 0 }
    });

    if (content !== "") {
      // The find drops into the poet and disappears.
      this.addAnimation({
        targets: `#${this.view.id} .item-${this.position}`,
        offset: executionCtx.getCurrentTimeInMs() + 120,
        duration: 180,
        transformations: { translateY: 40, opacity: 0 }
      });
    }

    executionCtx.fastForward(220);

    return content;
  }

  private isEmoji(executionCtx: ExecutionContext, thing: Shared.JikiObject): boolean {
    if (!isString(thing)) {
      executionCtx.logicError(this.t("errors.isEmojiString"));
      return false;
    }
    return EMOJI_PATTERN.test(thing.value);
  }

  private recite(executionCtx: ExecutionContext, poem: Shared.JikiObject) {
    if (!isString(poem)) {
      executionCtx.logicError(this.t("errors.reciteString"));
      return;
    }

    this.recitedPoem = poem.value;
    this.recited = true;

    this.addAnimation({
      targets: `#${this.view.id} .bubble`,
      offset: executionCtx.getCurrentTimeInMs(),
      duration: 1,
      transformations: { innerHTML: poem.value }
    });
    this.animateIntoView(executionCtx, `#${this.view.id} .bubble`, { duration: 300, offset: 1 });
  }

  private addSquare(index: number, content: string) {
    const square = document.createElement("div");
    square.className = `square square-${index}`;
    square.style.position = "absolute";
    square.style.bottom = "0";
    square.style.height = "100%";
    square.style.left = `${(index + 1) * this.stepWidth}%`;
    square.style.width = `${this.stepWidth}%`;
    square.style.transform = "translateX(-50%)";

    if (content !== "") {
      const item = document.createElement("div");
      item.className = `item word item-${index}`;
      item.style.position = "absolute";
      item.style.bottom = "26%";
      item.style.left = "0";
      item.style.width = "100%";
      item.style.display = "flex";
      item.style.flexDirection = "column";
      item.style.alignItems = "center";

      // Words stack letter over letter; a single character stands on its own.
      for (const character of content) {
        const cell = document.createElement("div");
        cell.className = "letter";
        cell.textContent = character;
        item.appendChild(cell);
      }

      square.appendChild(item);
    }

    this.view.appendChild(square);
  }

  protected populateView() {
    const style = document.createElement("style");
    style.textContent = `
      #${this.view.id} { container-type: inline-size; position: relative; overflow: hidden; }
      #${this.view.id} .word { gap: 0.4cqw; }
      #${this.view.id} .letter {
        font-size: 4cqw;
        font-weight: 600;
        color: #193f7b;
        border: 1px solid var(--color-blue-300);
        width: 5.5cqw;
        height: 5.5cqw;
        text-align: center;
        background: white;
        box-shadow: 0 0 3px var(--color-blue-300);
        padding-top: 0.4cqw;
        box-sizing: border-box;
      }
      #${this.view.id} .poet { width: 9cqw; aspect-ratio: 101 / 82; }
      #${this.view.id} .poet img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; }
      #${this.view.id} .bubble { font-size: 3.4cqw; }
    `;
    this.view.appendChild(style);

    const sky = document.createElement("div");
    sky.className = "sky";
    sky.style.position = "absolute";
    sky.style.inset = "0";
    sky.style.background = "linear-gradient(#dceeff, #f4fbff)";
    this.view.appendChild(sky);

    const grass = document.createElement("div");
    grass.className = "grass";
    grass.style.position = "absolute";
    grass.style.bottom = "0";
    grass.style.left = "0";
    grass.style.width = "100%";
    grass.style.height = "22%";
    grass.style.background = "linear-gradient(#8ec96a, #5aa63f)";
    this.view.appendChild(grass);

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.style.position = "absolute";
    bubble.style.top = "4%";
    bubble.style.left = "8%";
    bubble.style.width = "84%";
    bubble.style.padding = "2% 3%";
    bubble.style.boxSizing = "border-box";
    bubble.style.textAlign = "center";
    bubble.style.background = "#ffffff";
    bubble.style.border = "2px solid #193f7b";
    bubble.style.borderRadius = "10px";
    bubble.style.opacity = "0";
    this.view.appendChild(bubble);

    const poet = document.createElement("div");
    poet.className = "poet";
    poet.style.position = "absolute";
    poet.style.bottom = "18%";
    poet.style.left = "0%";
    poet.style.transform = "translateX(-50%)";

    // Both walk frames sit stacked from the start, so swapping between them is
    // an opacity tween the timeline can run backwards, and neither image has to
    // be fetched mid-animation.
    [1, 2].forEach((frame) => {
      const image = document.createElement("img");
      image.className = `poet-frame poet-frame-${frame}`;
      image.src = `/static/images/exercise-assets/adventures-in-poetry/poet-${frame}.svg`;
      image.alt = "";
      image.style.opacity = frame === 1 ? "1" : "0";
      poet.appendChild(image);
    });

    this.view.appendChild(poet);
  }

  availableFunctions = [
    {
      name: "move",
      func: this.move.bind(this),
      descriptionKey: "describers.move",
      arity: 0 as const
    },
    {
      name: "is_emoji",
      func: this.isEmoji.bind(this),
      descriptionKey: "describers.isEmoji",
      arity: 1 as const
    },
    {
      name: "recite",
      func: this.recite.bind(this),
      descriptionKey: "describers.recite",
      arity: 1 as const
    }
  ];

  getState() {
    return {
      position: this.position,
      recited: this.recited,
      recitedPoem: this.recitedPoem ?? ""
    };
  }
}
