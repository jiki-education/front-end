"use client";

import { useTranslations } from "next-intl";
import styles from "./Hero.module.css";
import { SignupButton } from "./SignupButton";
import { AudienceChecks } from "./hero/AudienceChecks";
import { HeroVideo } from "./hero/HeroVideo";
import { WatchPrompt } from "./hero/WatchPrompt";
import { ScrollingTestimonials } from "./hero/ScrollingTestimonials";

export function Hero({ marquee }: { marquee: string[] }) {
  const t = useTranslations("landing.hero");

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.lhs}>
          {/* The headline sizes off its own column rather than the viewport, so it stays
              proportional to the copy beside it instead of to the window. */}
          <div className={styles.headlineBox}>
            <h1>
              {t.rich("headline", {
                highlight: (chunks) => <span className={styles.headlineHighlight}>{chunks}</span>
              })}
            </h1>
          </div>

          <p className={styles.tagline}>
            {t.rich("tagline", {
              year: new Date().getFullYear(),
              strong: (chunks) => <strong>{chunks}</strong>
            })}
          </p>

          <AudienceChecks />

          <div className={styles.ctaWrapper}>
            <SignupButton />
          </div>
        </div>

        <div className={styles.rhs}>
          <HeroVideo />
          <WatchPrompt />
        </div>
      </div>

      <ScrollingTestimonials marquee={marquee} />
    </section>
  );
}
