/**
 * All of the video's visual state in one object, and the reducer the scheduler dispatches into.
 *
 * The prototype spread this across ~18 loose variables and toggled classes directly on nodes.
 * Collecting it here means a beat is a pure state transition: React renders the class names and
 * CSS runs every transition, so the main thread does a reducer dispatch every ~145ms and
 * nothing else during the heaviest stretch.
 */

import { ALIENS, simulate } from "./simulation";
import { BAD, GOOD } from "./code-listing";
import { SHOT_MS, TIMELINE } from "./timeline";
import type { Action, CalloutId, CursorTarget, Outcome, Tab } from "./timeline";

/** A shot in flight: keyed so React can animate each one and drop it when it expires. */
export interface Shot {
  id: number;
  col: number;
  target: number;
}

export interface VideoState {
  callout: CalloutId | null;
  finale: boolean;
  /** Set one beat after `finale`, so the cards fade in after the layout has switched. */
  finaleShown: boolean;
  /**
   * Holds the finale's layout and colours while the cards fade out at the end of a loop. Without
   * it the cards keep their opacity through the 450ms fade but lose the finale styling instantly,
   * so they flip back to purple and snap to their in-video anchors on the way out.
   */
  finaleFading: boolean;
  /** The finale's two-stage emphasis: land on full purple, then settle to grey. */
  emphasis: "none" | "glow" | "lit";
  cursor: CursorTarget;
  cursorVisible: boolean;
  /** Whether the pointer shows the open hand. Decoupled from the track position so the glyph can
   *  flip on arrival rather than at the start of the reach — see the `grip` action. */
  gripping: boolean;
  scrubbing: boolean;
  runPressed: boolean;
  sendPressed: boolean;
  /** A brief click flash for targets without their own press state — the tabs and the caret. */
  clicked: boolean;
  laserCol: number;
  laserOffEdge: boolean;
  shots: Shot[];
  deadAliens: readonly boolean[];
  trackPct: number;
  trackMs: number;
  editValue: string;
  caret: boolean;
  errorShown: boolean;
  /** Bumped to retrigger the line-flash keyframe, which has to restart on each loop. */
  flashKey: number;
  outcome: Outcome;
  tab: Tab;
  shownMessages: number;
  typingKey: "chat4" | null;
  typingFraction: number;
  confettiFiring: boolean;
  scrimShown: boolean;
}

const NO_DEAD = ALIENS.map(() => false);

/** The video's opening state. Callouts are left out so the closing frame can rewind beneath them. */
export const INITIAL_STATE: VideoState = {
  callout: null,
  finale: false,
  finaleShown: false,
  finaleFading: false,
  emphasis: "none",
  cursor: { kind: "editLine" },
  // Resting by the code, so the opening frame already has a pointer rather than one appearing
  // from nowhere the moment it first moves.
  cursorVisible: true,
  gripping: false,
  scrubbing: false,
  runPressed: false,
  sendPressed: false,
  clicked: false,
  laserCol: 1,
  laserOffEdge: false,
  shots: [],
  deadAliens: NO_DEAD,
  trackPct: 0,
  trackMs: 0,
  editValue: BAD,
  caret: false,
  errorShown: false,
  flashKey: 0,
  outcome: "pending",
  tab: "instructions",
  shownMessages: 0,
  typingKey: null,
  typingFraction: 0,
  confettiFiring: false,
  scrimShown: false
};

/** Incrementing id for shots, so each gets a stable React key while in flight. */
let nextShotId = 0;

export function reducer(state: VideoState, action: Action): VideoState {
  switch (action.type) {
    // A hard reset back to the opening frame, including the callouts. `reset` deliberately keeps
    // them (the closing frame rewinds the stage beneath cards that are still up), so a run that
    // starts from anywhere other than the top of a loop — a tab returning to the foreground, or
    // reduced motion switching off — needs this instead, or it opens on the previous run's finale.
    case "rewind":
      return INITIAL_STATE;

    case "reset":
      // Keeps the callout fields: the closing frame rewinds the video while the cards stay up.
      return {
        ...INITIAL_STATE,
        callout: state.callout,
        finale: state.finale,
        finaleShown: state.finaleShown,
        finaleFading: state.finaleFading,
        emphasis: state.emphasis,
        cursorVisible: state.cursorVisible,
        flashKey: state.flashKey
      };

    // Leaving the finale, the cards fade out where they stand: `finaleFading` keeps their layout
    // and colours for the length of the fade, so they don't flip to purple and snap back to their
    // in-video anchors while still visible. `endFinaleFade` clears it once they're transparent.
    case "callout":
      return {
        ...state,
        callout: action.id,
        finale: false,
        finaleShown: false,
        finaleFading: state.finale || state.finaleFading,
        emphasis: "none"
      };

    case "endFinaleFade":
      return { ...state, finaleFading: false };

    // Two stages: `finale` switches the rails to their column layout with every card still
    // hidden, then `revealFinale` fades them in already in place. Doing both at once would snap
    // the cards across the screen from their in-video anchors.
    case "calloutsAll":
      return { ...state, finale: true, finaleShown: false, finaleFading: false, callout: null, emphasis: "none" };

    case "revealFinale":
      return { ...state, finaleShown: true, emphasis: "glow" };

    case "settleCallouts":
      return { ...state, emphasis: "lit" };

    case "cursor":
      return { ...state, cursor: action.target };

    case "cursorVisible":
      return { ...state, cursorVisible: action.visible };

    case "grip":
      return { ...state, gripping: action.gripping };

    case "scrubbing":
      return { ...state, scrubbing: action.scrubbing };

    case "pressRun":
      return { ...state, runPressed: action.pressed };

    case "pressSend":
      return { ...state, sendPressed: action.pressed };

    case "click":
      return { ...state, clicked: action.pressed };

    case "laser":
      return { ...state, laserCol: action.col, laserOffEdge: false };

    case "laserOffEdge":
      return { ...state, laserOffEdge: true };

    case "shoot": {
      const deadAliens = state.deadAliens.map((dead, i) => dead || i === action.target);
      return {
        ...state,
        shots: [...state.shots, { id: nextShotId++, col: action.col, target: action.target }],
        deadAliens
      };
    }

    case "expireShot":
      return { ...state, shots: state.shots.filter((s) => s.id !== action.id) };

    case "track":
      return { ...state, trackPct: action.pct, trackMs: action.ms };

    case "resetGame":
      return { ...state, laserCol: 1, laserOffEdge: false, deadAliens: NO_DEAD, shots: [], trackPct: 0, trackMs: 0 };

    case "editValue":
      return { ...state, editValue: action.value, caret: action.caret };

    case "errorLine":
      return { ...state, errorShown: action.show };

    case "flashEditLine":
      return { ...state, flashKey: state.flashKey + 1 };

    case "outcome":
      return { ...state, outcome: action.outcome };

    case "tab":
      return { ...state, tab: action.tab };

    case "showMessage":
      // Monotonic: messages only ever accumulate within a loop, and `reset` clears them.
      return { ...state, shownMessages: Math.max(state.shownMessages, action.n) };

    case "typeBox":
      return { ...state, typingKey: action.key, typingFraction: action.fraction };

    case "confetti":
      return { ...state, confettiFiring: action.firing };

    case "scrim":
      return { ...state, scrimShown: action.shown };

    default:
      return state;
  }
}

/**
 * The state the video is in `ms` into a loop.
 *
 * The timeline is pure and the reducer has no side effects, so any moment is reachable by
 * replaying the beats up to it rather than waiting for them. That is what makes the video
 * seekable at all — see `/dev/ltc-video`, which uses this to scrub while tuning the cursor
 * anchors in `stage-geometry.ts`.
 *
 * `flashEditLine` can't be replayed faithfully — it is a keyframe retrigger with nothing to
 * retrigger when frozen — but it is purely cosmetic.
 *
 * Shots need help, though. In the running video each one clears itself when its own animation
 * ends (`onShotEnd` → `expireShot`); a seeked frame runs no animations, so nothing would ever
 * expire and every shot of the run would be drawn stacked on the board at once. Replaying the
 * beats and then keeping only those fired within the last `SHOT_MS` reproduces what is actually
 * in flight at that moment, without the reducer needing to know about time.
 */
export function stateAt(ms: number): VideoState {
  // When each shot was fired, by the id the reducer gave it. Recorded during the replay rather
  // than matched up afterwards, so beats that clear the board (`resetGame`) can't put the shots
  // and their firing times out of step.
  const firedAt = new Map<number, number>();

  const state = TIMELINE.beats.reduce((acc, beat) => {
    if (beat.at > ms) return acc;
    const next = reducer(acc, beat.action);
    // A `shoot` beat always appends exactly one shot, so the last one is the shot it just made.
    if (beat.action.type === "shoot") {
      firedAt.set(next.shots[next.shots.length - 1].id, beat.at);
    }
    return next;
  }, INITIAL_STATE);

  const inFlight = state.shots.filter((shot) => ms - (firedAt.get(shot.id) ?? 0) < SHOT_MS);
  return inFlight.length === state.shots.length ? state : { ...state, shots: inFlight };
}

/**
 * The one still frame that says the whole thing, for `prefers-reduced-motion`: the fix made,
 * the exercise passed, and every card up at once.
 */
export function reducedMotionState(): VideoState {
  const runB = simulate(Number(GOOD));
  const deadAliens = ALIENS.map(() => false);
  runB.forEach((act) => {
    if (act.type === "shoot") deadAliens[act.target] = true;
  });
  const lastMove = [...runB].reverse().find((act) => act.type === "move");

  return {
    ...INITIAL_STATE,
    editValue: GOOD,
    deadAliens,
    laserCol: lastMove?.col ?? 1,
    trackPct: 1,
    trackMs: 0,
    outcome: "pass",
    scrimShown: true,
    finale: true,
    finaleShown: true,
    finaleFading: false,
    emphasis: "lit",
    cursorVisible: false
  };
}
