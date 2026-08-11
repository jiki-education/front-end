import { useTranslations } from "next-intl";
import CursorArrowIcon from "@/icons/cursor.svg";
import CursorClickIcon from "@/icons/cursor-click.svg";
import HandIcon from "@/icons/hand.svg";
import HandGrabbingIcon from "@/icons/hand-grabbing.svg";
import { ARROW_HOTSPOT, CURSOR_SIZE, CURSOR_VIEWBOX, HAND_HOTSPOT, TickIcon, WarningIcon } from "./icons";
import type { Hotspot } from "./icons";
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
        {/* A drawn heading, not a real one — scenery, kept out of the document outline. */}
        <div className={styles.modalTitle}>{t("successTitle")}</div>
        <p>{t("successBody")}</p>
        <span className={styles.go}>{t("successBtn")}</span>
      </div>
    </div>
  );
}

/** Confetti from both bottom corners. Particles only exist while firing so the keyframes restart cleanly. */
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
 * The fake mouse pointer, aimed at a named region rather than a measured rect (the stage is a fixed
 * scaled box, so every anchor is a constant). Its hotspot is placed on the anchor by `hotspotOffset`.
 */
export function Cursor({ state }: { state: VideoState }) {
  const { x, y } = cursorOffset(state.cursor);
  const grabbing = state.scrubbing;
  // Open hand once the pointer reaches the thumb (`gripping`), closed while dragging; a button press
  // shows the click glyph, otherwise the plain arrow.
  const clicking = state.runPressed || state.sendPressed || state.clicked;

  let Icon = CursorArrowIcon;
  let hotspot = ARROW_HOTSPOT;
  if (grabbing) {
    Icon = HandGrabbingIcon;
    hotspot = HAND_HOTSPOT;
  } else if (state.gripping) {
    Icon = HandIcon;
    hotspot = HAND_HOTSPOT;
  } else if (clicking) {
    Icon = CursorClickIcon;
  }

  const { dx, dy } = hotspotOffset(hotspot);

  // The wrapper is one stable element carrying the anchor that transitions, so the pointer travels
  // instead of jumping; only the glyph inside swaps, carrying its own instant hotspot offset.
  return (
    <div
      className={`${styles.cursor} ${grabbing ? styles.cursorScrubbing : ""} ${
        state.cursorVisible ? "" : styles.cursorHidden
      }`}
      aria-hidden="true"
      style={{ transform: `translate3d(${x}px, ${y}px, 0)`, "--step": `${STEP / SPEED}ms` } as React.CSSProperties}
    >
      <Icon className={styles.cursorGlyph} style={{ transform: `translate(${dx}px, ${dy}px)` }} />
    </div>
  );
}

/** How far to shift the pointer element so a hotspot given in 256-space lands on the anchor. */
function hotspotOffset(hotspot: Hotspot): { dx: number; dy: number } {
  const unit = CURSOR_SIZE / CURSOR_VIEWBOX;
  return { dx: -hotspot.x * unit, dy: -hotspot.y * unit };
}
