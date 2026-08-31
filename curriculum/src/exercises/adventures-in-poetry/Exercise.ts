import { type ExecutionContext, type Shared, isString } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";
import metadata from "./metadata.json";

// Anything the poet can find on a square. A word is any other string.
export const FLAG = "🏁";
const EMOJI_PATTERN = /\p{Extended_Pictographic}/u;

const PUNCTUATION = "',";

// The bubble hangs from this line, growing upwards as the poem wraps, and the
// tail straddles it. The tail is kept inside these bounds so it never lands on
// a rounded corner of the bubble.
const BUBBLE_BOTTOM = 28;

// The poet is POET_WIDTH cqw wide and centred on its square. The container is
// `container-type: inline-size`, so 1cqw is 1% of the same box a `left`
// percentage resolves against, and the two units are interchangeable here.
const POET_WIDTH = 14;
const TAIL_MIN_PERCENT = 11;
const TAIL_MAX_PERCENT = 89;

// The tile behind every letter, emoji and mark. The plate is `currentColor`, so
// a tile's colour is set by the `color` on its own class and nothing else.
const TILE_SVG = `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<rect x="1.5" y="1.5" width="61" height="61" rx="6.5" fill="currentColor" stroke="#222222" stroke-width="3"/>
<circle opacity="0.5" cx="9" cy="55" r="3" fill="#222222"/>
<circle opacity="0.5" cx="55" cy="55" r="3" fill="#222222"/>
<circle opacity="0.5" cx="9" cy="9" r="3" fill="#222222"/>
<circle opacity="0.5" cx="55" cy="9" r="3" fill="#222222"/>
</svg>`;

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

    // The poet turns to face the reader before reciting. The flip goes on the
    // images rather than the container, whose transform is doing the centring.
    this.addAnimation({
      targets: `#${this.view.id} .poet img`,
      offset: executionCtx.getCurrentTimeInMs(),
      duration: 250,
      transformations: { scaleX: -1 }
    });

    this.addAnimation({
      targets: `#${this.view.id} .bubble`,
      offset: executionCtx.getCurrentTimeInMs() + 250,
      duration: 1,
      transformations: { innerHTML: poem.value }
    });
    // Point the tail at the poet's left edge, not their centre.
    const poetPercent = (this.position + 1) * this.stepWidth - POET_WIDTH / 2;
    const tailPercent = Math.min(Math.max(poetPercent, TAIL_MIN_PERCENT), TAIL_MAX_PERCENT);
    this.addAnimation({
      targets: `#${this.view.id} .bubble-tail`,
      offset: executionCtx.getCurrentTimeInMs() + 250,
      duration: 1,
      transformations: { left: `${tailPercent}%` }
    });

    this.animateIntoView(executionCtx, `#${this.view.id} .bubble`, { duration: 300, offset: 251 });
    this.animateIntoView(executionCtx, `#${this.view.id} .bubble-tail`, { duration: 300, offset: 251 });
    executionCtx.fastForward(300);
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
      item.style.bottom = "25%";
      item.style.left = "0";
      item.style.width = "100%";
      item.style.display = "flex";
      item.style.flexDirection = "column";
      item.style.alignItems = "center";

      // Words stack letter over letter; a single character stands on its own.
      const kind = EMOJI_PATTERN.test(content) ? "emoji" : PUNCTUATION.includes(content) ? "mark" : "letter";

      for (const character of content) {
        const cell = document.createElement("div");
        cell.className = `tile tile-${kind}`;
        cell.innerHTML = TILE_SVG;

        const glyph = document.createElement("span");
        glyph.className = "glyph";
        glyph.textContent = character;
        cell.appendChild(glyph);

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
      #${this.view.id} .word { gap: 0.2cqw; }
      #${this.view.id} .tile {
        position: relative;
        width: 6cqw;
        height: 6cqw;
        display: grid;
        place-items: center;
      }
      #${this.view.id} .tile svg { position: absolute; inset: 0; width: 100%; height: 100%; }
      #${this.view.id} .glyph {
        position: relative;
        font-size: 3.5cqw;
        font-weight: 600;
        line-height: 1;
        filter: drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.5));
      }
      #${this.view.id} .tile-letter { color: var(--color-blue-700); }
      #${this.view.id} .tile-letter .glyph { color: white; }
      #${this.view.id} .tile-mark { color: var(--color-green-500); }
      #${this.view.id} .tile-mark .glyph { color: white; }
      #${this.view.id} .tile-emoji { color: var(--color-gray-100); }
      #${this.view.id} .poet { width: 14cqw; aspect-ratio: 101 / 82; }
      #${this.view.id} .poet img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; }
      #${this.view.id} .bubble {
        font-size: 5cqw;
        font-weight: 600;
        line-height: 1.25;
        color: var(--color-blue-800);
      }
      #${this.view.id} .bubble-tail {
        position: absolute;
        box-sizing: border-box;
        width: 4cqw;
        height: 4cqw;
        background: white;
        border-right: 0.6cqw solid var(--color-blue-800);
        border-bottom: 0.6cqw solid var(--color-blue-800);
        transform: translateX(-50%) rotate(45deg);
      }
    `;
    this.view.appendChild(style);

    const sky = document.createElement("div");
    sky.className = "sky";
    sky.style.position = "absolute";
    sky.style.inset = "0";
    sky.style.background = "white";
    this.view.appendChild(sky);

    // A band of distant hills sitting on the grass line. Stretched to one copy
    // across the width rather than tiled, so the horizon reads as one range
    // instead of a repeating motif.
    const hills = document.createElement("div");
    hills.className = "hills";
    hills.style.position = "absolute";
    hills.style.bottom = "14%";
    hills.style.left = "0";
    hills.style.width = "100%";
    hills.style.height = "35%";
    hills.style.backgroundImage = "url(/static/images/exercise-assets/adventures-in-poetry/hills.svg)";
    hills.style.backgroundSize = "100% 100%";
    hills.style.backgroundPosition = "bottom center";
    hills.style.backgroundRepeat = "no-repeat";
    this.view.appendChild(hills);

    const grass = document.createElement("div");
    grass.className = "grass";
    grass.style.position = "absolute";
    grass.style.bottom = "0";
    grass.style.left = "0";
    grass.style.width = "100%";
    grass.style.height = "14%";
    grass.style.background = "linear-gradient(#8ec96a, #5aa63f)";
    this.view.appendChild(grass);

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.style.position = "absolute";
    bubble.style.bottom = `${BUBBLE_BOTTOM}%`;
    bubble.style.left = "6%";
    bubble.style.right = "6%";
    bubble.style.padding = "3% 4%";
    bubble.style.boxSizing = "border-box";
    bubble.style.textAlign = "center";
    bubble.style.background = "#ffffff";
    bubble.style.border = "0.6cqw solid var(--color-blue-800)";
    bubble.style.borderRadius = "2.5cqw";
    bubble.style.boxShadow = "0 0 8px var(--color-blue-200)";
    bubble.style.opacity = "0";
    bubble.style.zIndex = "3";
    this.view.appendChild(bubble);

    // Sits on the bubble's bottom edge, half in and half out, and is moved to
    // the poet's column when they recite. Above the bubble, so its white fill
    // covers the run of border it stands on.
    const tail = document.createElement("div");
    tail.className = "bubble-tail";
    tail.style.bottom = `calc(${BUBBLE_BOTTOM}% - 2cqw)`;
    tail.style.left = "50%";
    tail.style.opacity = "0";
    tail.style.zIndex = "4";
    this.view.appendChild(tail);

    const poet = document.createElement("div");
    poet.className = "poet";
    poet.style.position = "absolute";
    poet.style.bottom = "10%";
    poet.style.left = "0%";
    poet.style.transform = "translateX(-50%)";
    poet.style.zIndex = "2";

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
