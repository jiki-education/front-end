"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { staticAsset } from "@/lib/static-asset";
import ExercismIcon from "@/icons/exercism.svg";
import styles from "./AuthLayout.module.css";

interface AuthLayoutProps {
  children: ReactNode;
  // Pages load these on the server with getAuthPanelProps(). The quote strip
  // is left out when there are no quotes.
  marquee?: string[];
  fromExercism?: boolean;
}

export function AuthLayout({ children, marquee = [], fromExercism = false }: AuthLayoutProps) {
  const t = useTranslations("auth.layout");

  return (
    <div className={styles.layout}>
      {children}

      <aside className={styles.rightSide} aria-label={t("asideLabel")}>
        <div className={styles.intro}>
          <div className={styles.logoCard}>
            <Image
              src={staticAsset("images/auth/jiki-by-exercism.webp")}
              alt={t("logoAlt")}
              width={300}
              height={113}
              className={styles.logo}
              priority
            />
          </div>

          <h2 className={styles.tagline}>
            {t.rich("tagline", { emphasis: (chunks) => <span className={styles.emphasis}>{chunks}</span> })}
          </h2>
          <p className={styles.description}>{t("description")}</p>

          {fromExercism && <ExercismSteps />}
          <p className={styles.free}>{t("free")}</p>
        </div>

        {marquee.length > 0 && <QuoteStrip quotes={marquee} />}
      </aside>
    </div>
  );
}

// People arriving from Exercism also see how Jiki and Exercism fit together.
function ExercismSteps() {
  const t = useTranslations("auth.layout");
  const strong = (chunks: ReactNode) => <strong>{chunks}</strong>;

  return (
    <ol className={styles.steps} aria-label={t("stepsLabel")}>
      <li className={styles.step}>
        <span className={styles.stepIcon}>
          <Image src={staticAsset("images/auth/jiki-face.webp")} alt="" width={36} height={35} />
        </span>
        <span className={styles.stepText}>
          <span className={styles.stepTitle}>{t.rich("stepJiki", { strong })}</span>
          <span className={styles.stepDetail}>{t("stepJikiDetail")}</span>
        </span>
      </li>
      <li className={styles.stepArrow} aria-hidden="true">
        →
      </li>
      <li className={styles.step}>
        <span className={styles.stepIcon}>
          <ExercismIcon className={styles.exercismIcon} />
        </span>
        <span className={styles.stepText}>
          <span className={styles.stepTitle}>{t.rich("stepExercism", { strong })}</span>
          <span className={styles.stepDetail}>{t("stepExercismDetail")}</span>
        </span>
      </li>
    </ol>
  );
}

// The list is rendered twice so the loop has no visible jump; the copy is
// hidden from screen readers.
function QuoteStrip({ quotes }: { quotes: string[] }) {
  const t = useTranslations("auth.layout");
  // Keeps the scroll speed steady whatever the number of quotes
  const duration = `${quotes.length * 5}s`;

  return (
    <section className={styles.ticker} aria-label={t("testimonialsLabel")}>
      {/* The strip scrolls leftward in every locale, so it keeps its own direction in RTL */}
      <div className={styles.tickerViewport} dir="ltr">
        <div className={styles.tickerTrack} style={{ animationDuration: duration }}>
          <QuoteList quotes={quotes} />
          <QuoteList quotes={quotes} hidden />
        </div>
      </div>
    </section>
  );
}

function QuoteList({ quotes, hidden = false }: { quotes: string[]; hidden?: boolean }) {
  const t = useTranslations("auth.layout");

  return (
    <>
      {quotes.map((quote, i) => (
        <figure key={i} className={styles.tickItem} aria-hidden={hidden || undefined}>
          <span className={styles.stars} role="img" aria-label={t("testimonialStars")}>
            {[0, 1, 2, 3, 4].map((star) => (
              <StarIcon key={star} />
            ))}
          </span>
          <blockquote className={styles.quote}>{quote}</blockquote>
        </figure>
      ))}
    </>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
    </svg>
  );
}
