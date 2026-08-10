/**
 * The demo's inline icons and sprites.
 *
 * Inline rather than files in `app/icons/`: these are part of a simulated screenshot of the app,
 * not real UI icons, and several are drawn at sizes the shared icon set doesn't carry. Keeping
 * them here means the stage stays one self-contained piece of scenery.
 */

export function ResetIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

export function PlayIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 4l14 8-14 8z" />
    </svg>
  );
}

export function ChevronIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}

export function LinesIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function ChatIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M21 12a8 8 0 0 1-8 8H8l-5 3 1.5-5A8 8 0 1 1 21 12z" />
    </svg>
  );
}

export function LogIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 6h10M4 12h16M4 18h7" />
    </svg>
  );
}

export function InfoIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4M12 8.5v.01" strokeLinecap="round" />
    </svg>
  );
}

export function SendIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
      <path d="M5.49683 12.5c0 0.8284 0.67157 1.5 1.5 1.5 0.82842 0 1.5 -0.6716 1.5 -1.5l0 -7.38185 2.44247 2.44251c0.5858 0.58579 1.5356 0.58579 2.1214 0 0.5857 -0.58579 0.5857 -1.53553 0 -2.12132l-5.00004 -5c-0.58579 -0.585787 -1.53553 -0.585787 -2.12132 0l-5 5c-0.585787 0.58579 -0.585787 1.53553 0 2.12132 0.58579 0.58579 1.53553 0.58579 2.12132 0l2.43617 -2.43617 0 7.37551Z" />
    </svg>
  );
}

export function WarningIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      style={{ flex: "none" }}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4.5M12 16v.01" strokeLinecap="round" />
    </svg>
  );
}

/** The success tick: the ring draws, then the mark, then the whole thing settles. */
export function TickIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 52 52" aria-hidden="true">
      <circle cx="26" cy="26" r="23" />
      <path d="M15 27.5l7.5 7.5L38 18.5" />
    </svg>
  );
}

/**
 * The arrow, shifted so its tip sits exactly on the element's origin.
 *
 * The source path starts at (5, 2.5), which at the rendered 38px left several pixels of dead
 * space above and left of the tip — so the pointer appeared to click with its middle. Translating
 * the path by that offset makes the hotspot the element's own top-left corner, which is what the
 * anchor coordinates assume.
 */
export function CursorIcon() {
  return (
    <g transform="translate(-5, -2.5)">
      <path d="M5 2.5l13 9.5-6 .8 3 7.2-2.6 1.2-3-7.2-4.4 4.2z" />
    </g>
  );
}

/**
 * A closed grabbing hand, for the beat where the learner drags the scrubber. The fingers curl
 * around the thumb, so the hotspot is the middle of the grip rather than a tip.
 */
export function GrabCursorIcon() {
  return (
    <g transform="translate(-12, -11)">
      <path d="M8 11V6.6a1.6 1.6 0 0 1 3.2 0V10m0-.6a1.6 1.6 0 0 1 3.2 0V11m0-.4a1.6 1.6 0 0 1 3.2 0V11m-9.6 0V9.4a1.6 1.6 0 0 0-3.2 0v4.2c0 4 3 6.4 6.6 6.4s6.2-2.4 6.2-6.4V11" />
    </g>
  );
}

/**
 * Reassembled from the four quadrant SVGs in
 * `curriculum/images/exercise-assets/space-invaders/`, drawn white rather than inverted.
 *
 * Inlined per instance rather than referenced through one `<symbol>` + `<use>`: `use` resolves
 * against the document, which makes it fragile under a component that may mount more than once.
 */
export function AlienSprite() {
  return (
    <svg viewBox="0 0 200 160" aria-hidden="true">
      <path
        fill="currentColor"
        d="M183.337 83.3313V50H166.675V33.3313H150V25H166.675V0H141.675V16.6625H125V33.3313H75V16.6625H58.3375V0H33.3375V25H50V33.3313H33.3375V50H16.675V83.3313H0V141.663H25V108.331H33.3375V141.663H50V158.331H91.675V133.331H58.3375V125H141.675V133.331H108.337V158.331H150V141.663H166.675V108.331H175V141.663H200V83.3313H183.337ZM75 75H50V50H75V75ZM150 75H125V50H150V75Z"
      />
    </svg>
  );
}

export function LaserSprite() {
  return (
    <svg viewBox="0 0 200 115" aria-hidden="true">
      <rect y="72" width="200" height="43" fill="#34FF00" />
      <rect x="14" y="53" width="173" height="24" fill="#34FF00" />
      <rect x="77" y="36" width="47" height="24" fill="#34FF00" />
      <rect x="90" width="20" height="46" fill="#34FF00" />
    </svg>
  );
}
