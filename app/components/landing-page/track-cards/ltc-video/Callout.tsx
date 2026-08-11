import { useTranslations } from "next-intl";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { CalloutId } from "./timeline";
import styles from "./LtcVideo.module.css";

/**
 * One margin callout: page copy sitting beside the video, timed to the beat it describes.
 *
 * The highlighted phrase is swept by a marker as the card comes up, reading top line to bottom
 * line the way the copy itself is read.
 *
 * On the closing frame the cards are a summary rather than annotations, so the marker comes off
 * and the phrase renders as plain text.
 */
export function Callout({ id, shown, finale }: { id: CalloutId; shown: boolean; finale: boolean }) {
  const t = useTranslations("landing.learnToCode.callouts");

  return (
    <aside className={`${styles.callout} ${styles[`callout_${id}`]} ${shown ? styles.calloutShown : ""}`}>
      <h4>{t(`${id}.title`)}</h4>
      <p>
        {t.rich(`${id}.body`, {
          hl: (chunks) => <Marker swept={shown && !finale}>{chunks}</Marker>
        })}
      </p>
    </aside>
  );
}

/**
 * The marker sweep.
 *
 * A wrapped phrase has to fill one line at a time, top to bottom. A single span can't do that:
 * `box-decoration-break: clone` gives every wrapped fragment its own background box, and one
 * `background-size` transition drives all of them together, so every line fills at once. So the
 * phrase is measured once and re-rendered as one span per visual line, each staggered off its
 * line index (see `--line` in the stylesheet).
 *
 * Splitting is a pure function of where the browser wrapped the text, so it survives translation,
 * re-wrapping, and any font the copy lands in — nothing here assumes a line count or a language.
 */
function Marker({ swept, children }: { swept: boolean; children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState<string[] | null>(null);

  // Measured in place against the live inline flow. A detached or cloned probe is not good
  // enough: the phrase sits mid-sentence, so where it wraps depends on the words before it on
  // the first line, and a probe laid out on its own breaks in a different place.
  // Re-measured on resize because the rail narrows with the viewport and the phrase re-wraps.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    let scheduled = false;
    // Replacing the split only when the wrap actually changed is what keeps a sweep animatable:
    // re-rendering these spans mid-transition would remount them at their end state, and the card
    // resizes constantly while it animates in.
    const measure = () => {
      scheduled = false;
      const next = splitIntoVisualLines(el);
      setLines((prev) => (sameLines(prev, next) ? prev : next));
    };
    measure();

    // Measuring rewrites the span's children, which retriggers the observer; coalescing into a
    // frame keeps that from looping.
    const observer = new ResizeObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(measure);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [children]);

  const classes = [styles.highlight, swept ? styles.highlightSwept : "", lines ? "" : styles.highlightUnmeasured]
    .filter(Boolean)
    .join(" ");

  if (!lines) {
    return (
      <span ref={ref} className={classes}>
        <span className={styles.highlightLine}>{children}</span>
      </span>
    );
  }

  return (
    <span ref={ref} className={classes}>
      {lines.map((line, i) => (
        <span
          key={i}
          className={styles.highlightLine}
          style={{ "--line": i } as React.CSSProperties}
        >
          {line}
        </span>
      ))}
    </span>
  );
}

function sameLines(a: string[] | null, b: string[] | null): boolean {
  if (a === b) return true;
  if (!a || !b || a.length !== b.length) return false;
  return a.every((line, i) => line === b[i]);
}

/**
 * Where the browser actually broke the phrase.
 *
 * `Range.getClientRects()` returns one rect per visual line, so walking the text one character at
 * a time and watching which rect the character falls into finds the break points without needing
 * a span per word. Returns null when the phrase fits on one line — nothing to stagger, so the
 * unsplit render stands.
 */
function splitIntoVisualLines(el: HTMLElement): string[] | null {
  const text = el.textContent;
  if (!text) return null;

  // Flatten to a single text node so the measurement sees the phrase exactly as the browser lays
  // it out in the sentence — and so re-measuring an already-split phrase reads the same geometry
  // as the first pass. React owns these children, so they are restored below before it renders.
  const original = [...el.childNodes];
  const source = document.createTextNode(text);
  el.replaceChildren(source);

  const restore = () => el.replaceChildren(...original);

  const range = document.createRange();
  range.selectNodeContents(el);
  // jsdom (and any non-layout environment) has no `Range.getClientRects`; without real geometry
  // there is nothing to split on, so fall back to the unsplit render rather than throwing.
  if (typeof range.getClientRects !== "function" || range.getClientRects().length <= 1) {
    restore();
    return null;
  }

  // Group characters by the top edge of their own rect: same top means same visual line.
  const lines: string[] = [];
  let current = "";
  let lineTop: number | null = null;

  for (let i = 0; i < text.length; i++) {
    range.setStart(source, i);
    range.setEnd(source, i + 1);
    // A zero-width or absent rect is the space a line breaks on; it belongs to the line being
    // closed, not the one starting. (Indexing past the end yields undefined here, which the DOM
    // types don't express, so this is a runtime guard the types think is unreachable.)
    const rect = range.getClientRects()[0] as DOMRect | undefined;
    if (!rect?.width) {
      current += text[i];
      continue;
    }

    if (lineTop !== null && Math.abs(rect.top - lineTop) > 1) {
      lines.push(current);
      current = "";
    }
    lineTop = rect.top;
    current += text[i];
  }

  if (current) lines.push(current);
  restore();

  return lines.length > 1 ? lines : null;
}
