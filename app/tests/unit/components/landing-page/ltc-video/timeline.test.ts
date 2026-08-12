import {
  CODE,
  CODE_TOKENS,
  EDIT_LINE,
  GOOD,
  tokenize
} from "@/components/landing-page/track-cards/ltc-video/code-listing";
import { ALIENS, COLS, boardAt, simulate } from "@/components/landing-page/track-cards/ltc-video/simulation";
import { INITIAL_STATE, reducer, stateAt } from "@/components/landing-page/track-cards/ltc-video/state";
import { SHOT_MS, STEP, TIMELINE } from "@/components/landing-page/track-cards/ltc-video/timeline";

describe("simulation", () => {
  it("walks off the right edge with the buggy boundary", () => {
    const actions = simulate(20);
    expect(actions[actions.length - 1]).toEqual({ type: "error" });
    expect(actions.some((a) => a.type === "win")).toBe(false);
  });

  it("clears every alien with the corrected boundary", () => {
    const actions = simulate(Number(GOOD));
    expect(actions[actions.length - 1]).toEqual({ type: "win" });
    const killed = new Set(actions.filter((a) => a.type === "shoot").map((a) => a.target));
    expect(killed.size).toBe(ALIENS.length);
  });

  it("never leaves the board on the winning run", () => {
    simulate(Number(GOOD)).forEach((action) => {
      if (action.type === "move") {
        expect(action.col).toBeGreaterThanOrEqual(1);
        expect(action.col).toBeLessThanOrEqual(COLS);
      }
    });
  });
});

describe("timeline", () => {
  it("is ordered and finishes within its stated duration", () => {
    const ats = TIMELINE.beats.map((beat) => beat.at);
    expect(ats).toEqual([...ats].sort((a, b) => a - b));
    expect(Math.max(...ats)).toBeLessThan(TIMELINE.duration);
  });

  it("tells the whole story: fails, gets help, is fixed, then passes", () => {
    const order = (predicate: (action: (typeof TIMELINE.beats)[number]["action"]) => boolean) =>
      TIMELINE.beats.findIndex((beat) => predicate(beat.action));

    const fails = order((a) => a.type === "outcome" && a.outcome === "fail");
    const asksJiki = order((a) => a.type === "tab" && a.tab === "jiki");
    const fixed = order((a) => a.type === "editValue" && a.value === GOOD);
    const passes = order((a) => a.type === "outcome" && a.outcome === "pass");

    expect(fails).toBeGreaterThan(-1);
    expect(asksJiki).toBeGreaterThan(fails);
    expect(fixed).toBeGreaterThan(asksJiki);
    expect(passes).toBeGreaterThan(fixed);
  });

  it("takes each callout in turn, then ends with all of them up at once", () => {
    const shown = new Set(
      TIMELINE.beats.flatMap((beat) => (beat.action.type === "callout" && beat.action.id ? [beat.action.id] : []))
    );
    // "next" is the one card with no beat of its own — it only appears in the closing frame,
    // where every card is shown together. Same as the design prototype.
    expect(shown).toEqual(new Set(["tested", "see", "rewind", "errors", "help"]));
    expect(TIMELINE.beats.some((beat) => beat.action.type === "calloutsAll")).toBe(true);
  });
});

describe("reducer", () => {
  it("ends holding the closing frame: cards lit, stage rewound underneath", () => {
    const final = TIMELINE.beats.reduce((state, beat) => reducer(state, beat.action), INITIAL_STATE);
    expect(final.finale).toBe(true);
    expect(final.emphasis).toBe("lit");
    // The last beats rewind the video so the hold looks the same however the loop got there.
    expect(final.outcome).toBe("pending");
    expect(final.cursorVisible).toBe(false);
  });

  it("switches the rails to their finale layout while every card is hidden", () => {
    const types = TIMELINE.beats.map((b) => b.action.type);
    const dismiss = TIMELINE.beats.findIndex(
      (b) =>
        b.action.type === "callout" && b.action.id === null && types.indexOf("calloutsAll") > TIMELINE.beats.indexOf(b)
    );
    const layout = types.indexOf("calloutsAll");
    const reveal = types.indexOf("revealFinale");

    // Cards are dismissed, then the layout switches, and only then do they fade in — otherwise
    // they snap across the screen from their in-video anchors.
    expect(dismiss).toBeLessThan(layout);
    expect(layout).toBeLessThan(reveal);

    const atLayout = TIMELINE.beats.slice(0, layout + 1).reduce((s, b) => reducer(s, b.action), INITIAL_STATE);
    expect(atLayout.finale).toBe(true);
    expect(atLayout.finaleShown).toBe(false);
    expect(atLayout.callout).toBeNull();
  });

  it("celebrates as soon as the last alien dies", () => {
    const passesAt = TIMELINE.beats.find((b) => b.action.type === "outcome" && b.action.outcome === "pass")!.at;
    const lastShot = Math.max(...TIMELINE.beats.filter((b) => b.action.type === "shoot").map((b) => b.at));
    // No dead air between the winning shot and the celebration.
    expect(passesAt - lastShot).toBeLessThanOrEqual(STEP);
  });

  it("celebrates before it rewinds", () => {
    const passesAt = TIMELINE.beats.findIndex((b) => b.action.type === "outcome" && b.action.outcome === "pass");
    const confettiAt = TIMELINE.beats.findIndex((b) => b.action.type === "confetti");
    const lastReset = TIMELINE.beats.map((b) => b.action.type).lastIndexOf("reset");
    expect(confettiAt).toBeGreaterThan(-1);
    expect(lastReset).toBeGreaterThan(passesAt);
    expect(lastReset).toBeGreaterThan(confettiAt);
  });

  it("clears the callouts too when the scheduler starts cold", () => {
    // A tab returning to the foreground restarts the timeline from the top. `reset` alone would
    // leave the abandoned run's finale on screen through the opening beats, so a cold start
    // dispatches `rewind` instead.
    const atFinale = TIMELINE.beats.reduce((state, beat) => reducer(state, beat.action), INITIAL_STATE);
    expect(atFinale.finale).toBe(true);

    expect(reducer(atFinale, { type: "rewind" })).toEqual(INITIAL_STATE);
  });

  it("keeps the callouts up when the frame rewinds under them", () => {
    const withCallouts = reducer(INITIAL_STATE, { type: "calloutsAll" });
    const rewound = reducer(withCallouts, { type: "reset" });
    expect(rewound.finale).toBe(true);
    expect(rewound.outcome).toBe("pending");
    expect(rewound.editValue).toBe(INITIAL_STATE.editValue);
  });

  it("marks the alien a shot kills and retires the streak when it lands", () => {
    const fired = reducer(INITIAL_STATE, { type: "shoot", col: 2, target: 0 });
    expect(fired.deadAliens[0]).toBe(true);
    expect(fired.shots).toHaveLength(1);

    const landed = reducer(fired, { type: "expireShot", id: fired.shots[0].id });
    expect(landed.shots).toHaveLength(0);
    // The alien stays dead once the streak has gone.
    expect(landed.deadAliens[0]).toBe(true);
  });
});

describe("scrubbing back through the failing run", () => {
  const RUN = simulate(20);
  /** The run replayed up to `at`, the way the scheduler would have played it. */
  const play = (at: number) =>
    TIMELINE.beats.filter((b) => b.at <= at).reduce((s, b) => reducer(s, b.action), INITIAL_STATE);
  const seeks = TIMELINE.beats.filter((b) => b.action.type === "seek");

  it("scrubs backwards through the run and then forwards again", () => {
    const steps = seeks.map((b) => (b.action as { step: number }).step);
    const lowest = Math.min(...steps);
    const turn = steps.indexOf(lowest);

    // Down to the turning point, then back up to where the run broke.
    expect(steps.slice(0, turn + 1)).toEqual([...steps.slice(0, turn + 1)].sort((a, b) => b - a));
    expect(steps.slice(turn)).toEqual([...steps.slice(turn)].sort((a, b) => a - b));
    // A step is a frame between actions, so the run's last frame is one past its final action.
    expect(steps[steps.length - 1]).toBe(RUN.length);
  });

  it("brings the aliens killed after the scrub point back to life", () => {
    const deadAt = (at: number) => play(at).deadAliens.filter(Boolean).length;

    const beforeScrub = seeks[0].at - 1;
    const turningPoint = seeks.reduce((low, b) =>
      (b.action as { step: number }).step < (low.action as { step: number }).step ? b : low
    );
    const afterScrub = seeks[seeks.length - 1].at;

    // All five kills of the failing run are on the board, some come back, then all five return.
    expect(deadAt(beforeScrub)).toBe(5);
    expect(deadAt(turningPoint.at)).toBeLessThan(5);
    expect(deadAt(afterScrub)).toBe(5);
  });

  it("replays each crossed kill as a streak, downwards on the way back", () => {
    const shotsBySeek = seeks.map((beat) => {
      const before = play(beat.at - 1).shots;
      const after = play(beat.at).shots;
      return { dir: (beat.action as { dir: string }).dir, added: after.slice(before.length) };
    });

    const backwards = shotsBySeek.filter((s) => s.dir === "back").flatMap((s) => s.added);
    const forwards = shotsBySeek.filter((s) => s.dir === "forward").flatMap((s) => s.added);

    // Two kills sit between the scrub's endpoints, so each pass replays both.
    expect(backwards).toHaveLength(2);
    expect(forwards).toHaveLength(2);
    expect(backwards.every((shot) => shot.dir === "down")).toBe(true);
    expect(forwards.every((shot) => shot.dir === "up")).toBe(true);
    // The same two aliens, undone on the way back and killed again on the way forward.
    expect(backwards.map((s) => s.target).sort()).toEqual(forwards.map((s) => s.target).sort());
  });

  it("shows a rewound streak on a seeked frame, and drops it once it has landed", () => {
    // The dev scrubber rebuilds a frame from scratch, so it has to age the scrub's streaks too.
    const crossing = seeks.find((beat) => {
      const before = play(beat.at - 1).shots.length;
      return play(beat.at).shots.length > before;
    })!;

    expect(stateAt(crossing.at).shots).toHaveLength(1);
    expect(stateAt(crossing.at + SHOT_MS).shots).toHaveLength(0);
  });

  it("leaves the cannon back off the edge where the run broke", () => {
    const ended = play(seeks[seeks.length - 1].at);
    expect(ended.laserOffEdge).toBe(true);
    expect(ended.deadAliens.every(Boolean)).toBe(false);
  });

  it("seeks to the same board the run itself reached", () => {
    // A seek is only honest if it matches what playing the run forwards would have produced.
    [...RUN, null].forEach((_, step) => {
      const board = boardAt(RUN, step);
      const seeked = reducer(INITIAL_STATE, { type: "seek", step, dir: "forward" });
      expect(seeked.deadAliens).toEqual(board.deadAliens);
      expect(seeked.laserCol).toBe(board.col);
      expect(seeked.laserOffEdge).toBe(board.offEdge);
    });
  });
});

describe("code listing", () => {
  it("has a single editable line, at the index the timeline edits", () => {
    expect(CODE.filter((line) => line === null)).toHaveLength(1);
    expect(CODE[EDIT_LINE]).toBeNull();
  });

  it("colours keywords and calls apart from plain text", () => {
    const tokens = tokenize("  if is_alien_above() do");
    expect(tokens.find((t) => t.text === "if")?.kind).toBe("kw");
    expect(tokens.find((t) => t.text === "is_alien_above")?.kind).toBe("fn");
    expect(tokenize("set position to 1").find((t) => t.text === "1")?.kind).toBe("nm");
  });

  it("pre-tokenises every static line, leaving only the edited one to render time", () => {
    expect(CODE_TOKENS).toHaveLength(CODE.length);
    CODE_TOKENS.forEach((tokens, i) => {
      const line = CODE[i];
      if (line === null) {
        expect(tokens).toBeNull();
      } else {
        expect(tokens).toEqual(tokenize(line));
      }
    });
    expect(CODE_TOKENS[EDIT_LINE]).toBeNull();
  });

  it("round-trips the line it is given", () => {
    const line = "    change position to position + 1";
    expect(
      tokenize(line)
        .map((t) => t.text)
        .join("")
    ).toBe(line);
  });
});
