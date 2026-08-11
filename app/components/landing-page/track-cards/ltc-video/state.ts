// All of the video's visual state in one object, and the reducer the scheduler dispatches into.

import { ALIENS, simulate } from "./simulation";
import { BAD, GOOD } from "./code-listing";
import { SHOT_MS, TIMELINE } from "./timeline";
import type { Action, CalloutId, CursorTarget, Outcome, Tab } from "./timeline";

/** A shot in flight, keyed so React can drop it when it expires. */
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
  /** Holds the finale's layout and colours while the cards fade out, so they don't flip back mid-fade. */
  finaleFading: boolean;
  /** The finale's two-stage emphasis: land on full purple, then settle to grey. */
  emphasis: "none" | "glow" | "lit";
  cursor: CursorTarget;
  cursorVisible: boolean;
  /** Whether the pointer shows the open hand; decoupled from the track position so it flips on arrival. */
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
  /** Bumped to retrigger the line-flash keyframe on each loop. */
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
  // Resting by the code, so the opening frame already has a pointer on screen.
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
    // A hard reset back to the opening frame including the callouts, for starts mid-loop where `reset` would open on the previous run's finale.
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

    // Leaving the finale, `finaleFading` keeps the cards' layout and colours for the fade so they don't flip back while still visible.
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

    // `finale` switches the rails to their column layout with cards hidden; `revealFinale` then fades them in already in place.
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
 * The state the video is in `ms` into a loop, by replaying the beats — the pure timeline is what makes
 * it seekable. Shots are the exception: they normally clear on `animationend`, so here we keep only
 * those fired within the last `SHOT_MS`.
 */
export function stateAt(ms: number): VideoState {
  // When each shot was fired, recorded during the replay so a board-clearing `resetGame` can't
  // put the shots and their firing times out of step.
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

/** The one still frame for `prefers-reduced-motion`: the fix made, the exercise passed, every card up. */
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
