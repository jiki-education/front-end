import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import type { CalloutId } from "./timeline";
import styles from "./LtcVideo.module.css";

/**
 * One margin callout: page copy sitting beside the video, timed to the beat it describes.
 *
 * The highlighted phrase is swept by a marker as the card comes up — one continuous fill across
 * the whole phrase, driven by a single background-size transition. The prototype drew it per word
 * with one timer each and read `offsetTop` off every word to find line breaks (~22 forced layouts
 * in one pass on the closing frame); the phrase reads as one marked block either way, so the
 * cheaper version is also the more faithful one.
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

/** The marker sweep. `box-decoration-break: clone` keeps the fill continuous across line wraps. */
function Marker({ swept, children }: { swept: boolean; children: ReactNode }) {
  return <span className={`${styles.highlight} ${swept ? styles.highlightSwept : ""}`}>{children}</span>;
}
