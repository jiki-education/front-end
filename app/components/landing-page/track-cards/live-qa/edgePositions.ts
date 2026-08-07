/**
 * Where faces are allowed to appear around the photo.
 *
 * A slot is an edge plus a band along it — `top-left` is "somewhere in the first third
 * of the top edge". The exact point is picked within that band each time, so faces do
 * not land on the same spots repeatedly, while the slots stay coarse enough to reason
 * about which are near each other.
 *
 * Slots are listed in perimeter order, clockwise from the top-left. Keeping that order
 * is what makes "not near the last one" an index distance rather than geometry.
 *
 * The top-right quarter has no slots at all.
 */

type Edge = "top" | "right" | "bottom" | "left";
type Band = "start" | "middle" | "end";

export interface EdgePosition {
  /** Percentages across and down the photo. The face is centred on this point. */
  x: number;
  y: number;
  /** Which side of the face its bubble opens on, and which way it grows. */
  side: "left" | "right";
  vertical: "up" | "down";
}

/** How far along an edge each band runs. Held off 0 and 100 so faces miss the corners,
 *  where a bubble has nowhere to go. */
const BANDS: Record<Band, [number, number]> = {
  start: [8, 28],
  middle: [35, 65],
  end: [72, 92]
};

// Clockwise from the top-left. The gap between `top-middle` and `right-middle` is the
// top-right quarter, deliberately left empty.
const SLOTS: { key: string; edge: Edge; band: Band }[] = [
  { key: "top-left", edge: "top", band: "start" },
  { key: "top-middle", edge: "top", band: "middle" },
  { key: "right-middle", edge: "right", band: "middle" },
  { key: "right-bottom", edge: "right", band: "end" },
  { key: "bottom-right", edge: "bottom", band: "end" },
  { key: "bottom-middle", edge: "bottom", band: "middle" },
  { key: "bottom-left", edge: "bottom", band: "start" },
  { key: "left-bottom", edge: "left", band: "end" },
  { key: "left-middle", edge: "left", band: "middle" },
  { key: "left-top", edge: "left", band: "start" }
];

export const SLOT_COUNT = SLOTS.length;

/** Turns a slot into an actual point, jittered within its band. */
export function resolvePosition(index: number, random: () => number): EdgePosition {
  const slot = SLOTS[index];
  const [from, to] = BANDS[slot.band];
  const along = from + random() * (to - from);

  const { x, y } =
    slot.edge === "top"
      ? { x: along, y: 0 }
      : slot.edge === "bottom"
        ? { x: along, y: 100 }
        : slot.edge === "right"
          ? { x: 100, y: along }
          : { x: 0, y: along };

  return {
    x,
    y,
    // Past the middle and a right-opening bubble runs off the photo.
    side: x > 60 ? "left" : "right",
    // Low down, the bubble opens upwards so it stays clear of the checks row below.
    vertical: y >= 72 ? "up" : "down"
  };
}

/** A slot blocks itself and the ones either side of it, wrapping round the perimeter. */
function blockedBy(index: number, radius: number): number[] {
  const blocked: number[] = [];
  for (let d = -radius; d <= radius; d++) blocked.push((index + d + SLOT_COUNT) % SLOT_COUNT);
  return blocked;
}

/**
 * How much room a new face claims from the recent ones, as [last, second-last] radii.
 *
 * Someone with a bubble needs real clearance, or two bubbles crowd each other. Someone
 * who only throws emoji can sit much closer, which also keeps the positions varied:
 * blocking two either side of both recent picks rules out all ten slots, and the
 * relaxation below then lands on the same few every time.
 */
const SPREAD = {
  speaker: [2, 1],
  watcher: [1, 0]
} as const;

/** Picks a slot at random from those not blocked by the last two used. */
export function pickSlot(
  last: number | null,
  secondLast: number | null,
  kind: keyof typeof SPREAD,
  random: () => number
): number {
  const [lastRadius, secondRadius] = SPREAD[kind];

  // Relax the older claim before the newer one: the face we just placed matters most.
  for (const [lr, sr] of [
    [lastRadius, secondRadius],
    [lastRadius, 0],
    [1, 0]
  ]) {
    const blocked = new Set<number>();
    if (last !== null) blockedBy(last, lr).forEach((i) => blocked.add(i));
    if (secondLast !== null) blockedBy(secondLast, sr).forEach((i) => blocked.add(i));

    const candidates = Array.from({ length: SLOT_COUNT }, (_, i) => i).filter((i) => !blocked.has(i));
    if (candidates.length > 0) return candidates[Math.floor(random() * candidates.length)];
  }

  return Math.floor(random() * SLOT_COUNT);
}
