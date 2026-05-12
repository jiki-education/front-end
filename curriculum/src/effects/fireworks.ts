import type { ExecutionContext } from "@jiki/interpreters";
import type { Animation } from "../VisualExercise";

const DURATION_MS = 1500;
const BURST_COUNT = 3;
const SPARKS_PER_BURST = 20;
const BURST_RADIUS = 110;
const RADIUS_JITTER = 40;

const COLORS = ["#ff3b30", "#ff9500", "#ffcc00", "#34c759", "#5ac8fa", "#007aff", "#af52de", "#ff2d55", "#ffffff"];

const BURST_POSITIONS: Array<{ left: string; top: string }> = [
  { left: "30%", top: "12%" },
  { left: "65%", top: "20%" },
  { left: "45%", top: "28%" },
  { left: "20%", top: "25%" },
  { left: "75%", top: "10%" }
];

// Tiny seeded PRNG so each call produces a stable (but varied) pattern.
function mulberry32(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function fireFireworks(view: HTMLElement, animations: Animation[], executionCtx: ExecutionContext) {
  const startTime = executionCtx.getCurrentTimeInMs();
  // Per-view call index so DOM IDs stay unique within this view across
  // repeated calls, without relying on module-level state that leaks between
  // exercise instances or test runs. Seed the PRNG from the
  // interpreter-controlled start time so identical runs produce identical
  // patterns.
  const callIndex = view.querySelectorAll(":scope > .firework").length;
  const rand = mulberry32(0xf17e ^ (startTime >>> 0));
  const burstDuration = DURATION_MS / BURST_COUNT;

  for (let b = 0; b < BURST_COUNT; b++) {
    const burstId = `firework-${callIndex}-${b}`;
    const pos = BURST_POSITIONS[b % BURST_POSITIONS.length];
    const burstStart = startTime + b * burstDuration;

    const burst = document.createElement("div");
    burst.className = "firework";
    burst.id = burstId;
    burst.style.left = pos.left;
    burst.style.top = pos.top;

    for (let i = 0; i < SPARKS_PER_BURST; i++) {
      const spark = document.createElement("div");
      spark.className = "spark";
      spark.style.backgroundColor = COLORS[Math.floor(rand() * COLORS.length)];
      burst.appendChild(spark);
    }
    view.appendChild(burst);

    for (let i = 0; i < SPARKS_PER_BURST; i++) {
      const angle = (i / SPARKS_PER_BURST) * Math.PI * 2 + rand() * 0.4;
      const radius = BURST_RADIUS + (rand() - 0.5) * 2 * RADIUS_JITTER;
      const dx = Math.cos(angle) * radius;
      const dy = Math.sin(angle) * radius;
      const target = `#${burstId} .spark:nth-child(${i + 1})`;

      animations.push({
        targets: target,
        offset: burstStart,
        duration: 1,
        transformations: { opacity: 1 }
      });

      animations.push({
        targets: target,
        offset: burstStart + 1,
        duration: burstDuration,
        easing: "easeOutQuad",
        transformations: {
          translateX: dx,
          translateY: dy,
          opacity: 0
        }
      });
    }
  }

  executionCtx.fastForward(DURATION_MS);
}
