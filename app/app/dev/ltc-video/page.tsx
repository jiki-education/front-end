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
  const [probe, setProbe] = useState<{ x: number; y: number } | null>(null);
  const [showAnchors, setShowAnchors] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);
  /** The drawn stage, relative to the wrapper — the box the overlay has to sit exactly on top of. */
  const [stageBox, setStageBox] = useState({ left: 0, top: 0, width: 0 });

  // Measured rather than derived: the stage's scale and its position within the three-column
  // layout both move with the breakpoint, and this page only has to be right, not fast.
  useEffect(() => {
    const measure = () => {
      const wrap = wrapRef.current;
      // The cursor's own parent *is* the stage, which beats matching on a class name — this page's
      // wrapper is called `stageWrap`, so a `[class*='stage']` lookup matches it first and every
      // measurement comes back in the wrong space.
      const stage = wrap?.querySelector<HTMLElement>("svg[class*='cursor']")?.parentElement;
      if (!wrap || !stage) return;
      const wrapBox = wrap.getBoundingClientRect();
      const box = stage.getBoundingClientRect();
      // The cursor is `inset: 0` inside the stage, so its origin is the stage's padding box — one
      // scaled border-width in from the border box `getBoundingClientRect` reports. Small, but it
      // is the difference between the crosshair agreeing with the pointer and sitting beside it.
      const border = parseFloat(getComputedStyle(stage).borderTopWidth) * (box.width / STAGE_WIDTH);
      setStageBox({
        left: box.left - wrapBox.left + border,
        top: box.top - wrapBox.top + border,
        width: box.width
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

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
    if (next) setMs(next.at);
  };

  /**
   * Clicks arrive in CSS pixels on the scaled stage; dividing by its rendered width recovers the
   * fraction, and multiplying by the internal width gives stage units — the space `ANCHORS` is
   * written in. Deriving the scale from the measured box rather than hardcoding 0.55 keeps the
   * numbers correct at any breakpoint.
   */
  const readCoords = (event: React.MouseEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current;
    if (!wrap || !stageBox.width) return;
    const wrapBox = wrap.getBoundingClientRect();
    const unitsPerPx = STAGE_WIDTH / stageBox.width;
    setProbe({
      x: Math.round((event.clientX - wrapBox.left - stageBox.left) * unitsPerPx),
      y: Math.round((event.clientY - wrapBox.top - stageBox.top) * unitsPerPx)
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
            value={ms}
            onChange={(event) => setMs(Number(event.target.value))}
            aria-label="Timeline position"
          />
          <span className={styles.time}>
            {ms}ms <span className={styles.dim}>/ {TIMELINE.duration}ms</span>
          </span>
        </div>

        {/* Every cursor move on the timeline, as a tick you can jump straight to. */}
        <div className={styles.markers}>
          {cursorBeats.map((beat, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.marker} ${beat.at === ms ? styles.markerActive : ""}`}
              style={{ insetInlineStart: `${(beat.at / TIMELINE.duration) * 100}%` }}
              onClick={() => setMs(beat.at)}
              title={`${beat.at}ms — ${describeTarget(beat.action)}`}
              aria-label={`Jump to ${beat.at}ms`}
            />
          ))}
        </div>

        <div className={styles.buttons}>
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
        {showAnchors && stageBox.width > 0 && <AnchorOverlay probe={probe} tip={tip} stageBox={stageBox} />}
      </div>
    </div>
  );
}

/** The stage's internal coordinate width, mirrored from `--stage-w`. */
const STAGE_WIDTH = 1040;

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
  stageBox: { left: number; top: number; width: number };
}) {
  const scale = stageBox.width / STAGE_WIDTH;
  const place = (point: { x: number; y: number }) => ({
    insetInlineStart: `${stageBox.left + point.x * scale}px`,
    insetBlockStart: `${stageBox.top + point.y * scale}px`
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
