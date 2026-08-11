/**
 * The "video" as data: one sorted array of `{ at, action }`, built once at module load.
 *
 * The prototype rebuilt ~125 closures on every loop and mutated the DOM from each of them.
 * Here the timeline is pure and deterministic, so it is computed a single time and replayed;
 * the scheduler only dispatches actions into a reducer, and CSS owns every pixel of motion.
 */

import { BAD, GOOD } from "./code-listing";
import { COLS, simulate } from "./simulation";

/** ms per game action. Also drives the CSS transition durations, so the two stay in step. */
export const STEP = 145;

/**
 * How long a shot is in flight, mirroring the `shot` animation in `LtcVideo.module.css`.
 *
 * In the running video a shot clears itself when its own animation ends. A seeked frame has no
 * animations to end, so `stateAt` uses this to work out which shots would still be mid-flight at
 * that moment — see the note there.
 */
export const SHOT_MS = 110;

/**
 * One knob for the whole thing: every beat and every CSS duration the timeline sets is divided
 * by this, so the video runs faster without any beat drifting out of step with its animation.
 */
export const SPEED = 1.15;

/**
 * How long to let the pointer travel before the action it reached for fires — a click, a caret, the
 * first keystroke. The cursor's CSS transition is a fixed 500ms, and beats are scheduled at
 * `at / SPEED`, so a timeline gap of `500 × SPEED` is the point of arrival; this adds a little settle
 * on top so the pointer visibly lands before it acts, rather than clicking on the approach. Used
 * everywhere a reach precedes an action so they all pace the same.
 */
const REACH = Math.round(500 * SPEED) + 60;

/** The closing frame holds every card lit for this long before they settle. */
const ALL_GLOW_MS = 1500;

/** ms from the win to the cards arriving, so the congratulations lands first. */
const CARDS_AFTER_MODAL = 1800;

/** Matches the callout's opacity transition, so the in-video cards are gone before the set lands. */
const CALLOUT_FADE_MS = 450;

/** How long the finished frame holds before the loop restarts. */
const HOLD_MS = 4000;

/** How long the click glyph holds — matches the Run/Send press, so every click reads the same. */
const CLICK_MS = 200;

export type CalloutId = "see" | "rewind" | "tested" | "errors" | "help" | "next";
export type Outcome = "pending" | "fail" | "pass";
export type Tab = "instructions" | "jiki";
export type CursorTarget =
  | { kind: "runButton" }
  | { kind: "jikiTab" }
  | { kind: "instructionsTab" }
  | { kind: "chatBox" }
  | { kind: "chatSend" }
  | { kind: "editLine" }
  | { kind: "editLineEnd" }
  | { kind: "track"; pct: number };

/**
 * Every mutation the video performs, as a closed set. Anything not expressible here is a sign
 * the beat belongs in CSS instead.
 */
export type Action =
  | { type: "reset" }
  /** A hard reset including the callouts. Dispatched by the scheduler, never by the timeline. */
  | { type: "rewind" }
  | { type: "callout"; id: CalloutId | null }
  | { type: "calloutsAll" }
  | { type: "revealFinale" }
  | { type: "endFinaleFade" }
  | { type: "settleCallouts" }
  | { type: "cursor"; target: CursorTarget }
  | { type: "cursorVisible"; visible: boolean }
  /**
   * Whether the pointer shows the open hand. Kept separate from the `track` position so the arrow
   * can travel to the thumb and only become a hand as it arrives, rather than the moment it sets
   * off — the glyph was flipping a full move early otherwise.
   */
  | { type: "grip"; gripping: boolean }
  | { type: "scrubbing"; scrubbing: boolean }
  | { type: "pressRun"; pressed: boolean }
  | { type: "pressSend"; pressed: boolean }
  /**
   * A generic click flash for the targets that have no press state of their own — the tabs and the
   * caret placement. Flips the pointer to its click glyph for the brief press, the same tell the
   * Run and Send buttons give.
   */
  | { type: "click"; pressed: boolean }
  | { type: "laser"; col: number }
  | { type: "laserOffEdge" }
  | { type: "shoot"; col: number; target: number }
  /** Dispatched by the shot's own animation ending, not by the timeline. */
  | { type: "expireShot"; id: number }
  | { type: "track"; pct: number; ms: number }
  | { type: "resetGame" }
  | { type: "editValue"; value: string; caret: boolean }
  | { type: "errorLine"; show: boolean }
  | { type: "flashEditLine" }
  | { type: "outcome"; outcome: Outcome }
  | { type: "tab"; tab: Tab }
  | { type: "showMessage"; n: number }
  | { type: "typeBox"; key: "chat4" | null; fraction: number }
  | { type: "confetti"; firing: boolean }
  | { type: "scrim"; shown: boolean };

export interface Beat {
  at: number;
  action: Action;
}

export interface Timeline {
  beats: Beat[];
  duration: number;
}

/**
 * Build the timeline. Called once at module scope — it takes no arguments and reads no DOM, so
 * the result is the same every loop.
 */
function buildTimeline(): Timeline {
  const beats: Beat[] = [];
  const push = (at: number, action: Action) => beats.push({ at: Math.round(at), action });
  let t = 0;

  // ---------- reset ----------
  push(0, { type: "reset" });
  push(0, { type: "callout", id: null });
  // The previous loop's closing cards are still on screen here. They fade out holding their
  // finale layout and colours; this drops that styling once they're transparent, in time for
  // the first in-video card below.
  push(CALLOUT_FADE_MS, { type: "endFinaleFade" });
  // The pointer rests by the code from the start, so the opening frame has one on screen rather
  // than it appearing out of nowhere when it first moves.
  push(0, { type: "cursor", target: { kind: "editLine" } });
  push(0, { type: "cursorVisible", visible: true });
  // Opens on the code itself, once the previous loop's closing cards have finished fading.
  push(CALLOUT_FADE_MS + 50, { type: "callout", id: "tested" });
  t = 700;

  // ---------- beat 1: a moment to read the code before it runs ----------
  t += 900;

  // ---------- beat 2: press Run ----------
  push(t, { type: "cursor", target: { kind: "runButton" } });
  t += REACH;
  push(t, { type: "pressRun", pressed: true });
  push(t + 200, { type: "pressRun", pressed: false });
  t += 430;

  // ---------- beat 3: the failing run ----------
  push(t - 150, { type: "callout", id: "see" });
  const runA = simulate(Number(BAD));
  push(t, { type: "track", pct: 1, ms: runA.length * STEP }); // one continuous sweep
  runA.forEach((act, i) => {
    const at = t + i * STEP;
    if (act.type === "move") push(at, { type: "laser", col: act.col });
    if (act.type === "shoot") push(at, { type: "shoot", col: act.col, target: act.target });
    if (act.type === "error") push(at, { type: "laserOffEdge" });
  });
  t += runA.length * STEP + 240;

  // ---------- beat 4: the error lands ----------
  push(t, { type: "editValue", value: BAD, caret: false });
  push(t, { type: "errorLine", show: true });
  push(t, { type: "outcome", outcome: "fail" });
  push(t, { type: "callout", id: "errors" });
  t += 2600;

  // ---------- beat 4b: scrub back through the run ----------
  // The learner drags the scrubber backwards and the cannon retraces its steps, which is what
  // "Rewind your own code" is pointing at.
  const lastCol = COLS;
  const backTo = 7;
  const scrubTo = (at: number, col: number) => {
    const pct = (col - 1) / (lastCol - 1);
    push(at, { type: "laser", col });
    push(at, { type: "track", pct, ms: STEP });
    push(at, { type: "cursor", target: { kind: "track", pct } });
  };

  push(t, { type: "callout", id: "rewind" });
  push(t, { type: "laser", col: lastCol }); // back off the edge, onto the last column
  push(t, { type: "cursor", target: { kind: "track", pct: 1 } }); // reach for the thumb, still an arrow
  push(t + 450, { type: "grip", gripping: true }); // become a hand only as it lands, not on setting off
  t += 600;
  push(t, { type: "scrubbing", scrubbing: true });
  for (let col = lastCol - 1; col >= backTo; col--) {
    scrubTo(t, col);
    t += STEP;
  }
  t += 450;
  for (let col = backTo + 1; col <= lastCol; col++) {
    scrubTo(t, col);
    t += STEP;
  }
  push(t, { type: "scrubbing", scrubbing: false });
  push(t, { type: "grip", gripping: false }); // lifts off the thumb as an arrow again
  push(t, { type: "laserOffEdge" }); // back to where it broke
  push(t, { type: "track", pct: 1, ms: STEP });
  t += 1100;

  // ---------- beat 5: over to Ask Jiki ----------
  push(t, { type: "cursor", target: { kind: "jikiTab" } });
  t += REACH; // land on the tab before it switches
  pushClick(push, t); // click the tab
  push(t, { type: "errorLine", show: false });
  push(t, { type: "tab", tab: "jiki" });
  push(t, { type: "callout", id: "help" });
  push(t, { type: "showMessage", n: 1 }); // already in the thread when it opens
  push(t, { type: "showMessage", n: 2 });
  t += 350;

  push(t, { type: "showMessage", n: 3 }); // Jiki asks about the boundary
  t += 1100; // a beat to read it, then straight in
  t = pushTyping(push, t) + 250; // "Eleven."
  t = pushSend(push, t, 4) + 900;
  push(t, { type: "showMessage", n: 5 }); // Jiki confirms the fix
  t += 800;

  // ---------- beat 6: back to the instructions, then edit that one value in place ----------
  push(t, { type: "callout", id: null });
  push(t, { type: "cursor", target: { kind: "instructionsTab" } }); // reach the tab...
  t += REACH;
  pushClick(push, t); // ...click it...
  push(t, { type: "tab", tab: "instructions" }); // ...and it switches back
  t += 300;
  push(t, { type: "cursor", target: { kind: "editLineEnd" } });
  t += REACH; // let the pointer reach the line before the caret drops in
  pushClick(push, t); // click into the line to place the caret
  // Put the caret just after the boundary value
  push(t, { type: "editValue", value: BAD, caret: true });
  t += 280;
  // Backspace over the wrong value...
  for (let i = BAD.length - 1; i >= 0; i--) {
    push(t, { type: "editValue", value: BAD.slice(0, i), caret: true });
    t += 150;
  }
  t += 200;
  // ...and type the right one
  for (let i = 1; i <= GOOD.length; i++) {
    push(t, { type: "editValue", value: GOOD.slice(0, i), caret: true });
    t += 120;
  }
  t += 250;
  push(t, { type: "flashEditLine" });
  // Long enough for the green flash to read as "that's the fix", short enough that the pointer
  // heads for Run while it's still fading rather than after a dead pause. The flash keyframe
  // (1.6s) outlives this and fades out on its own as the cursor moves.
  t += 550;

  // ---------- beat 7: rerun, and this time it wins ----------
  push(t, { type: "cursor", target: { kind: "runButton" } });
  t += REACH;
  push(t, { type: "pressRun", pressed: true });
  push(t + 200, { type: "pressRun", pressed: false });
  push(t + 200, { type: "resetGame" });
  push(t + 200, { type: "editValue", value: GOOD, caret: false });
  push(t + 200, { type: "outcome", outcome: "pending" });
  t += 430;

  const runB = simulate(Number(GOOD));
  push(t, { type: "track", pct: 1, ms: runB.length * STEP });
  runB.forEach((act, i) => {
    const at = t + i * STEP;
    if (act.type === "move") push(at, { type: "laser", col: act.col });
    if (act.type === "shoot") push(at, { type: "shoot", col: act.col, target: act.target });
  });
  // Timed off the shot that clears the board rather than the end of the action list: `win` is a
  // marker with no animation of its own, so counting it in would leave dead air between the last
  // alien dying and the celebration. The bar is driven home in the same breath.
  const lastShotIndex = runB.reduce((last, act, i) => (act.type === "shoot" ? i : last), 0);
  t += lastShotIndex * STEP;
  push(t, { type: "track", pct: 1, ms: STEP });

  // Only celebrate if the run actually won — the simulation is the source of truth.
  if (runB.some((a) => a.type === "win")) {
    push(t, { type: "outcome", outcome: "pass" });
    push(t, { type: "confetti", firing: true });
    push(t + 200, { type: "scrim", shown: true });
  } else {
    push(t, { type: "outcome", outcome: "fail" });
  }

  // The modal gets a beat on its own. Then the in-video cards are dismissed, and only once they
  // have faded do all six arrive laid out in their columns — switching the rails from absolute to
  // flex under visible cards would snap them across the screen in a single frame.
  const cardsAt = t + CARDS_AFTER_MODAL;
  push(cardsAt - CALLOUT_FADE_MS, { type: "callout", id: null });
  push(cardsAt, { type: "calloutsAll" });
  // A frame later, so the browser paints the new layout before the fade begins.
  push(cardsAt + 50, { type: "revealFinale" });

  const settlesAt = cardsAt + ALL_GLOW_MS;
  push(settlesAt, { type: "settleCallouts" });
  push(settlesAt, { type: "reset" });
  push(settlesAt, { type: "cursorVisible", visible: false });

  return {
    beats: beats.sort((a, b) => a.at - b.at),
    duration: settlesAt + HOLD_MS
  };
}

type Push = (at: number, action: Action) => void;

/**
 * Type the learner's reply into the chat box.
 *
 * The reply is short and fixed, so the typing is a fixed number of ticks: 11 at 55ms is a little
 * over half a second, which reads as typing rather than pasting. Every locale takes exactly this
 * long — the translation is sliced by fraction rather than per character, so a long one simply
 * lands more characters per tick and the loop runs to the same duration in all of them.
 */
function pushTyping(push: Push, from: number) {
  const TICK = 55;
  const ticks = 11;

  push(from, { type: "cursor", target: { kind: "chatBox" } }); // reach for the box first...
  const startsAt = from + REACH; // ...and let the cursor land before a key is pressed
  push(startsAt, { type: "typeBox", key: "chat4", fraction: 0 });
  for (let i = 1; i <= ticks; i++) {
    push(startsAt + i * TICK, { type: "typeBox", key: "chat4", fraction: i / ticks });
  }
  return startsAt + ticks * TICK;
}

/** Flash the click glyph at `at`, the tell shared with the Run and Send buttons. */
function pushClick(push: Push, at: number) {
  push(at, { type: "click", pressed: true });
  push(at + CLICK_MS, { type: "click", pressed: false });
}

/** Press send: the box empties and the message is posted. */
function pushSend(push: Push, from: number, messageNumber: number) {
  push(from, { type: "cursor", target: { kind: "chatSend" } });
  push(from + REACH, { type: "pressSend", pressed: true }); // press only once the pointer is on the button
  push(from + REACH + 200, { type: "pressSend", pressed: false });
  push(from + REACH + 200, { type: "typeBox", key: null, fraction: 0 });
  push(from + REACH + 200, { type: "showMessage", n: messageNumber });
  return from + REACH + 200;
}

/** Built once: the timeline is pure, so every loop replays the same array. */
export const TIMELINE = buildTimeline();
