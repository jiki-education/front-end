import { useTranslations } from "next-intl";
import { CursorIcon, GrabCursorIcon, TickIcon, WarningIcon } from "./icons";
import { CONFETTI, cursorOffset } from "./stage-geometry";
import type { VideoState } from "./state";
import { SPEED, STEP } from "./timeline";
import styles from "./LtcVideo.module.css";

/** The end-of-line error widget, anchored to the code line it belongs to. */
export function ErrorCallout({ shown }: { shown: boolean }) {
  const t = useTranslations("landing.learnToCode.demo");
  return (
    <div className={`${styles.errorCallout} ${shown ? styles.errorCalloutShown : ""}`}>
      <div className={styles.errorTitle}>
        <WarningIcon />
        <span>{t("errorTitle")}</span>
      </div>
      <div className={styles.errorBody}>{t("errorBody")}</div>
    </div>
  );
}

/** The success modal, over a spotlight scrim. */
export function SuccessModal({ shown }: { shown: boolean }) {
  const t = useTranslations("landing.learnToCode.demo");
  return (
    <div className={`${styles.modalWrap} ${shown ? styles.modalWrapShown : ""}`}>
      <div className={styles.modal}>
        <TickIcon className={styles.tick} />
        {/* A drawn heading, not a real one: it is scenery inside the stage, so keeping it out of
            the document outline matters even though the stage is already `aria-hidden`. */}
        <div className={styles.modalTitle}>{t("successTitle")}</div>
        <p>{t("successBody")}</p>
        <span className={styles.go}>{t("successBtn")}</span>
      </div>
    </div>
  );
}

/**
 * Confetti from both bottom corners, in the brand colours from `lib/confetti.ts`. The spread is
 * deterministic so the burst is identical on every loop, and the particles only exist while
 * firing so the keyframes restart cleanly.
 */
export function Confetti({ firing }: { firing: boolean }) {
  return (
    <div className={`${styles.confetti} ${firing ? styles.confettiFiring : ""}`} aria-hidden="true">
      {firing &&
        CONFETTI.map((particle, i) => (
          <i
            key={i}
            style={
              {
                background: particle.color,
                left: particle.left,
                "--dx": particle.dx,
                "--dy": particle.dy,
                "--rot": particle.rot,
                animationDelay: particle.delay
              } as React.CSSProperties
            }
          />
        ))}
    </div>
  );
}

/**
 * The fake mouse pointer.
 *
 * Its target is a named region rather than a measured rect: the stage is a fixed 1040px drawn
 * through one `scale()`, so every anchor is knowable as a constant. That removes the prototype's
 * per-move `getBoundingClientRect` + `offsetWidth` reads, which forced layout on every one of
 * the eight scrub steps.
 */
export function Cursor({ state }: { state: VideoState }) {
  const { x, y } = cursorOffset(state.cursor);
  const grabbing = state.scrubbing;

  return (
    <svg
      className={`${styles.cursor} ${grabbing ? styles.cursorScrubbing : ""} ${
        state.cursorVisible ? "" : styles.cursorHidden
      }`}
      viewBox="0 0 24 24"
      fill={grabbing ? "none" : "#fff"}
      stroke="var(--color-gray-800)"
      strokeWidth={grabbing ? 1.7 : 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ transform: `translate3d(${x}px, ${y}px, 0)`, "--step": `${STEP / SPEED}ms` } as React.CSSProperties}
    >
      {/* A grabbing hand while dragging the scrubber, an arrow the rest of the time. */}
      {grabbing ? <GrabCursorIcon /> : <CursorIcon />}
    </svg>
  );
}
