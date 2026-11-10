import { useTranslations } from "next-intl";
import styles from "./Testimonials.module.css";

export const QUOTE_KEYS = [
  "challenge",
  "master",
  "community",
  "supportive",
  "confidence",
  "value",
  "investment"
] as const;

// A strip of short learner quotes that scrolls along the foot of a modal.
// The list is rendered twice so the loop has no visible jump; the copy is
// hidden from screen readers. The caller's className places the strip.
export function Testimonials({ className = "" }: { className?: string }) {
  const t = useTranslations("modals.premiumUpgrade");

  return (
    <section className={`${styles.testimonials} ${className}`} aria-label={t("testimonialsLabel")}>
      {/* The strip scrolls leftward in every locale, so it keeps its own direction in RTL */}
      <div className={styles.testimonialsViewport} dir="ltr">
        <div className={styles.testimonialsTrack}>
          <QuoteList />
          <QuoteList hidden />
        </div>
      </div>
    </section>
  );
}

function QuoteList({ hidden = false }: { hidden?: boolean }) {
  const t = useTranslations("modals.premiumUpgrade");

  return (
    <>
      {QUOTE_KEYS.map((key) => (
        <figure key={key} className={styles.testimonialItem} aria-hidden={hidden || undefined}>
          <div className={styles.testimonialStars} role="img" aria-label={t("testimonialStars")}>
            {[0, 1, 2, 3, 4].map((i) => (
              <StarIcon key={i} />
            ))}
          </div>
          <blockquote className={styles.testimonialQuote}>{t(`testimonials.${key}`)}</blockquote>
        </figure>
      ))}
    </>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" />
    </svg>
  );
}
