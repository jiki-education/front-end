"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LtcVideo } from "@/components/landing-page/track-cards/ltc-video/LtcVideo";
import { cursorOffset } from "@/components/landing-page/track-cards/ltc-video/stage-geometry";
import { stateAt } from "@/components/landing-page/track-cards/ltc-video/state";
import { SPEED, TIMELINE } from "@/components/landing-page/track-cards/ltc-video/timeline";
import styles from "./page.module.css";

/**
 * A scrubber for the LTC video, for tuning the cursor anchors in `stage-geometry.ts`.
 *
 * Seeking is exact rather than approximate: the timeline is a pure prebuilt array and the reducer
 * has no side effects, so `stateAt(ms)` replays every beat up to a moment and hands back the frame
 * it produces. Nothing waits on real time, so a 30s loop is inspectable instantly at any point.
 *
 * The overlay reports clicks in the stage's own 1040px units — the same space the anchors are
 * written in — so a misplaced cursor is fixed by clicking where it should have landed and pasting
 * the numbers straight into `ANCHORS`.
 */
export default function LtcVideoDevPage() {
  const [ms, setMs] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loop, setLoop] = useState(false);
  const [probe, setProbe] = useState<{ x: number; y: number } | null>(null);
  const [showAnchors, setShowAnchors] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);
  /**
   * The stage's border-box top-left relative to the wrapper, and the scale it is drawn at — the
   * exact mapping the pointer uses (`screen = topLeft + anchor × scale`), so the overlay sits on
   * the pointer. `scale` is rendered px per stage unit.
   */
  const [stageBox, setStageBox] = useState({ left: 0, top: 0, scale: 0 });

  // Measured rather than derived: the stage's scale and its position within the three-column
  // layout both move with the breakpoint, and this page only has to be right, not fast.
  useEffect(() => {
    const measure = () => {
      const wrap = wrapRef.current;
      // The cursor wrapper's own parent *is* the stage, which beats matching on a class name — this
      // page's wrapper is called `stageWrap`, so a `[class*='stage']` lookup matches it first and
      // every measurement comes back in the wrong space. Match the cursor's positioned `div` (whose
      // parent is the stage), not the glyph `svg` inside it — that svg's class also contains
      // "cursor", but its parent is the wrapper, which would measure a 38px box as the whole stage.
      const stage = wrap?.querySelector<HTMLElement>("div[class*='cursor']")?.parentElement;
      if (!wrap || !stage) return;
      const wrapBox = wrap.getBoundingClientRect();
      const box = stage.getBoundingClientRect();
      // The cursor is translated in the stage's own unscaled coordinates from its border-box
      // top-left, then the whole stage is scaled as one piece. So the anchor→screen mapping the
      // crosshair must match is exactly: border-box top-left + anchor × (that scale). Deriving the
      // scale from the transform (`renderedWidth / offsetWidth`) rather than `renderedWidth /
      // 1040` is what keeps the crosshair on the pointer: the latter divides by the content width
      // and so runs ~1.6% fast, drifting further from the pointer the larger the anchor.
      setStageBox({
        left: box.left - wrapBox.left,
        top: box.top - wrapBox.top,
        scale: box.width / stage.offsetWidth
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Read through refs so toggling loop, or resuming after a scrub, doesn't restart the clock.
  const loopRef = useRef(loop);
  loopRef.current = loop;
  const msRef = useRef(ms);
  msRef.current = ms;

  // Playback advances the same `ms` the slider writes, so playing and scrubbing stay one control
  // rather than two clocks that can disagree. Timed off the frame clock rather than a fixed
  // interval, so a slow frame doesn't make the run drift away from real playback speed.
  useEffect(() => {
    if (!playing) return;

    let frame = 0;
    let previous: number | null = null;

    // The running position lives here rather than being read back from state, so the clock never
    // depends on a render having landed between frames.
    let position = msRef.current;

    const tick = (now: number) => {
      const delta = previous === null ? 0 : now - previous;
      previous = now;
      position += delta * SPEED;

      if (position >= TIMELINE.duration) {
        if (!loopRef.current) {
          setMs(TIMELINE.duration);
          setPlaying(false);
          return;
        }
        // Wrapping by the overshoot rather than resetting to 0 keeps a looped run from losing a
        // few ms at every pass.
        position %= TIMELINE.duration;
      }

      setMs(position);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  const play = () => {
    // Replaying from the end restarts rather than sitting finished. The ref is written alongside
    // the state because the clock effect reads it before the render carrying the reset lands.
    if (ms >= TIMELINE.duration) {
      msRef.current = 0;
      setMs(0);
    }
    setPlaying(true);
  };

  const state = useMemo(() => stateAt(ms), [ms]);
  const target = state.cursor;
  const tip = cursorOffset(target);

  /** Every moment the cursor is told to move — the beats worth stepping between. */
  const cursorBeats = useMemo(() => TIMELINE.beats.filter((beat) => beat.action.type === "cursor"), []);

  const step = (direction: 1 | -1) => {
    const next =
      direction === 1
        ? cursorBeats.find((beat) => beat.at > ms)
        : [...cursorBeats].reverse().find((beat) => beat.at < ms);
    if (next) {
      setPlaying(false);
      setMs(next.at);
    }
  };

  /**
   * Clicks arrive in CSS pixels on the scaled stage; dividing by the stage's scale converts the
   * offset from its top-left back into stage units — the space `ANCHORS` is written in. Deriving
   * the scale from the transform keeps the numbers correct at any breakpoint.
   */
  const readCoords = (event: React.MouseEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current;
    if (!wrap || !stageBox.scale) return;
    const wrapBox = wrap.getBoundingClientRect();
    setProbe({
      x: Math.round((event.clientX - wrapBox.left - stageBox.left) / stageBox.scale),
      y: Math.round((event.clientY - wrapBox.top - stageBox.top) / stageBox.scale)
    });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>LTC video scrubber</h1>
        <p className={styles.blurb}>
          Seeks by replaying <code>TIMELINE.beats</code> through the reducer. Edit anchors in{" "}
          <code>ltc-video/stage-geometry.ts</code>. Click the stage to read coordinates in its own units.
        </p>
      </header>

      <div className={styles.controls}>
        <div className={styles.sliderRow}>
          <input
            className={styles.slider}
            type="range"
            min={0}
            max={TIMELINE.duration}
            step={10}
            value={Math.round(ms)}
            onChange={(event) => {
              setPlaying(false);
              setMs(Number(event.target.value));
            }}
            aria-label="Timeline position"
          />
          <span className={styles.time}>
            {Math.round(ms)}ms <span className={styles.dim}>/ {TIMELINE.duration}ms</span>
          </span>
        </div>

        {/* Every cursor move on the timeline, as a tick you can jump straight to. */}
        <div className={styles.markers}>
          {cursorBeats.map((beat, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.marker} ${beat.at === Math.round(ms) ? styles.markerActive : ""}`}
              style={{ insetInlineStart: `${(beat.at / TIMELINE.duration) * 100}%` }}
              onClick={() => {
                setPlaying(false);
                setMs(beat.at);
              }}
              title={`${beat.at}ms — ${describeTarget(beat.action)}`}
              aria-label={`Jump to ${beat.at}ms`}
            />
          ))}
        </div>

        <div className={styles.buttons}>
          <button
            type="button"
            className={`${styles.button} ${styles.playButton}`}
            onClick={() => (playing ? setPlaying(false) : play())}
          >
            {playing ? "❚❚ pause" : "▶ play"}
          </button>
          <button type="button" className={styles.button} onClick={() => setMs(0)}>
            ↺ restart
          </button>
          <label className={styles.toggle}>
            <input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} />
            loop
          </label>
          <button type="button" className={styles.button} onClick={() => step(-1)}>
            ← prev cursor beat
          </button>
          <button type="button" className={styles.button} onClick={() => step(1)}>
            next cursor beat →
          </button>
          <label className={styles.toggle}>
            <input type="checkbox" checked={showAnchors} onChange={(e) => setShowAnchors(e.target.checked)} />
            show anchor crosshairs
          </label>
        </div>

        <dl className={styles.readout}>
          <div>
            <dt>cursor target</dt>
            <dd>
              <code>{JSON.stringify(target)}</code>
            </dd>
          </div>
          <div>
            <dt>tip lands at</dt>
            <dd>
              <code>
                x: {Math.round(tip.x)} y: {Math.round(tip.y)}
              </code>
            </dd>
          </div>
          <div>
            <dt>last click</dt>
            <dd>
              <code>{probe ? `x: ${probe.x}  y: ${probe.y}` : "—"}</code>
            </dd>
          </div>
          <div>
            <dt>real playback</dt>
            <dd>
              <code>{Math.round(ms / SPEED)}ms</code> <span className={styles.dim}>(÷ SPEED {SPEED})</span>
            </dd>
          </div>
        </dl>
      </div>

      {/* The overlay is a sibling laid over the video rather than a wrapper, so it can't affect
          the stage's own layout or scaling. */}
      <div className={styles.stageWrap} onClick={readCoords} ref={wrapRef}>
        <LtcVideo frozenState={state} />
        {showAnchors && stageBox.scale > 0 && <AnchorOverlay probe={probe} tip={tip} stageBox={stageBox} />}
      </div>
    </div>
  );
}

/**
 * Crosshairs for the cursor's current tip and the last click.
 *
 * Both are given in stage units and drawn through the same scale the stage itself is drawn at, so
 * the green cross sits exactly where the pointer's tip is claimed to be. If it doesn't line up
 * with the drawn pointer, the sprite's tip has drifted from its origin — a CSS problem, not an
 * anchor one.
 */
function AnchorOverlay({
  probe,
  tip,
  stageBox
}: {
  probe: { x: number; y: number } | null;
  tip: { x: number; y: number };
  stageBox: { left: number; top: number; scale: number };
}) {
  const place = (point: { x: number; y: number }) => ({
    insetInlineStart: `${stageBox.left + point.x * stageBox.scale}px`,
    insetBlockStart: `${stageBox.top + point.y * stageBox.scale}px`
  });

  return (
    <div className={styles.overlay} aria-hidden="true">
      <i className={`${styles.cross} ${styles.crossTip}`} style={place(tip)} />
      {probe && <i className={`${styles.cross} ${styles.crossProbe}`} style={place(probe)} />}
    </div>
  );
}

/** Label for a marker's tooltip. */
function describeTarget(action: { type: string } & Record<string, unknown>) {
  const target = action.target as { kind: string; pct?: number } | undefined;
  if (!target) return action.type;
  return target.kind === "track" ? `track ${Math.round((target.pct ?? 0) * 100)}%` : target.kind;
}
