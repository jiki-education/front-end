"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { QUOTE_KEYS } from "@/lib/modal/modals/PremiumUpgradeModal/Testimonials";
import type { PremiumUpsellCardProps } from "./PremiumUpsellCard";
import { UpsellFooter } from "./UpsellFooter";
import styles from "./UpsellCard.module.css";
import ownStyles from "./TestimonialsCard.module.css";

const SLIDE_INTERVAL_MS = 5000;

// Learner quotes do the selling. They slide on every few seconds and hold
// while the pointer or focus is on them.
export function TestimonialsCard({ onUpgradeClick }: PremiumUpsellCardProps) {
  const t = useTranslations("dashboard.challengesSidebar.premiumUpsell");
  const tQuotes = useTranslations("modals.premiumUpgrade");
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    // Reduced motion leaves the learner to move between quotes with the dots.
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const id = window.setInterval(() => setCurrent((i) => (i + 1) % QUOTE_KEYS.length), SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section className={styles.card} aria-label={t("label")}>
      <h2 className={styles.title}>{t.rich("accelerate.heading", { highlight })}</h2>
      <p className={styles.message}>{t("testimonials.intro")}</p>

      <div
        className={ownStyles.carousel}
        aria-roledescription="carousel"
        aria-label={tQuotes("testimonialsLabel")}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* Slides move along a physical axis, so the track keeps its own direction in RTL. */}
        <div className={ownStyles.viewport} dir="ltr">
          <div className={ownStyles.track} style={{ transform: `translateX(-${current * 100}%)` }}>
            {QUOTE_KEYS.map((key, i) => (
              <figure
                key={key}
                className={ownStyles.slide}
                aria-roledescription="slide"
                aria-hidden={i !== current || undefined}
              >
                <div className={ownStyles.stars} role="img" aria-label={tQuotes("testimonialStars")}>
                  {[0, 1, 2, 3, 4].map((star) => (
                    <StarIcon key={star} />
                  ))}
                </div>
                <blockquote className={ownStyles.quote}>{tQuotes(`testimonials.${key}`)}</blockquote>
              </figure>
            ))}
          </div>
        </div>

        <div className={ownStyles.dots}>
          {QUOTE_KEYS.map((key, i) => (
            <button
              key={key}
              type="button"
              className={ownStyles.dot}
              aria-label={t("testimonials.show", { number: i + 1 })}
              aria-current={i === current || undefined}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      </div>

      <UpsellFooter onUpgradeClick={onUpgradeClick} />
    </section>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" />
    </svg>
  );
}

function highlight(chunks: React.ReactNode) {
  return <span className={styles.highlight}>{chunks}</span>;
}
