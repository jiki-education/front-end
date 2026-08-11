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
 *
 * Whichever glyph is showing, its hotspot — the arrow's tip, the hand's grip — is placed on the
 * anchor by `hotspotOffset` below, so the anchors in `stage-geometry.ts` always mean the click
 * point regardless of where in its own 256-box a given icon happens to draw that point.
 */
export function Cursor({ state }: { state: VideoState }) {
  const { x, y } = cursorOffset(state.cursor);
  const grabbing = state.scrubbing;
  // Over the scrubber the pointer becomes a hand: open while reaching for the thumb, closed while
  // dragging it. Pressing a button flips the arrow to its click form. Everywhere else it's the
  // plain arrow.
  const overTrack = state.cursor.kind === "track";
  const clicking = state.runPressed || state.sendPressed;

  let Icon = CursorArrowIcon;
  let hotspot = ARROW_HOTSPOT;
  if (grabbing) {
    Icon = HandGrabbingIcon;
    hotspot = HAND_HOTSPOT;
  } else if (overTrack) {
    Icon = HandIcon;
    hotspot = HAND_HOTSPOT;
  } else if (clicking) {
    Icon = CursorClickIcon;
  }

  const { dx, dy } = hotspotOffset(hotspot);

  // The positioned wrapper is one stable element for the whole video: only the glyph inside it
  // swaps. Putting the transition on a node that never remounts is what lets the pointer actually
  // travel to the scrubber and the Jiki tab — earlier the arrow⇄hand swap replaced the element, so
  // the fresh node had no prior transform to ease from and simply appeared at its destination.
  //
  // The wrapper carries only the anchor, which transitions; the glyph carries only its own
  // hotspot offset, which is instant. That shift is a dozen units and only ever changes on arrival,
  // as the pointer settles into a grab or a click, so it reads as the hand closing, not a jump.
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

/**
 * How far to shift the pointer element so a hotspot given in 256-space lands on the anchor.
 *
 * The element is `CURSOR_SIZE` wide showing the whole `CURSOR_VIEWBOX` box, so one viewBox unit is
 * `CURSOR_SIZE / CURSOR_VIEWBOX` rendered units; the hotspot sits that far from the element's
 * top-left, and the translate pulls it back onto the anchor.
 */
function hotspotOffset(hotspot: Hotspot): { dx: number; dy: number } {
  const unit = CURSOR_SIZE / CURSOR_VIEWBOX;
  return { dx: -hotspot.x * unit, dy: -hotspot.y * unit };
}
