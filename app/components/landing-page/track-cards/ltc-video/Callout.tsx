import { useTranslations } from "next-intl";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { CalloutId } from "./timeline";
import styles from "./LtcVideo.module.css";

/**
 * One margin callout: page copy beside the video, timed to the beat it describes, its phrase swept by
 * a marker as the card comes up. On the closing frame the marker comes off and it renders as plain text.
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
 * The marker sweep. To fill a wrapped phrase one line at a time, it's measured and re-rendered as one
 * span per visual line, each staggered off its line index. The split survives translation and re-wrapping.
 */
function Marker({ swept, children }: { swept: boolean; children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState<string[] | null>(null);

  // Measured in place against the live inline flow (the phrase sits mid-sentence), re-measured on resize.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    let scheduled = false;
    // Replace the split only when the wrap actually changed, or re-rendering mid-transition breaks the sweep.
    const measure = () => {
      scheduled = false;
      const next = splitIntoVisualLines(el);
      setLines((prev) => (sameLines(prev, next) ? prev : next));
    };
    measure();

    // Measuring rewrites the span's children and retriggers the observer; coalesce into a frame to avoid a loop.
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
        <span key={i} className={styles.highlightLine} style={{ "--line": i } as React.CSSProperties}>
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
 * Where the browser broke the phrase, found by walking each character and grouping by which rect from
 * `Range.getClientRects()` it lands in. Returns null when it fits on one line.
 */
function splitIntoVisualLines(el: HTMLElement): string[] | null {
  const text = el.textContent;
  if (!text) return null;

  // Flatten to a single text node so measurement sees the phrase as the browser lays it out; restored below for React.
  const original = [...el.childNodes];
  const source = document.createTextNode(text);
  el.replaceChildren(source);

  const restore = () => el.replaceChildren(...original);

  const range = document.createRange();
  range.selectNodeContents(el);
  // jsdom has no `Range.getClientRects`; without real geometry, fall back to the unsplit render.
  if (typeof range.getClientRects !== "function" || range.getClientRects().length <= 1) {
    restore();
    return null;
  }

  // Group characters by the top edge of their rect: same top means same visual line.
  const lines: string[] = [];
  let current = "";
  let lineTop: number | null = null;

  for (let i = 0; i < text.length; i++) {
    range.setStart(source, i);
    range.setEnd(source, i + 1);
    // A zero-width or absent rect is the space a line breaks on; it belongs to the line being closed.
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
