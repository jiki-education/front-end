"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import thom from "../assets/testimonials/thom.webp";
import { RoughHighlight } from "../RoughHighlight";
import styles from "./PullQuote.module.css";

// The one testimonial that closes the section off, under a rule.
export function PullQuote() {
  const t = useTranslations("landing.meetJeremy");

  return (
    <figure className={styles.quote}>
      <span className={styles.mark} aria-hidden="true">
        &ldquo;
      </span>
      {/* RoughHighlight brings its own observer, so the underline draws when the quote
          reaches the fold rather than with the prose above it. */}
      <blockquote>{t.rich("quote", { strong: (chunks) => <RoughHighlight>{chunks}</RoughHighlight> })}</blockquote>
      <figcaption className={styles.who}>
        <span className={styles.ring}>
          <Image src={thom} alt="" aria-hidden="true" sizes="40px" />
        </span>
        <div>
          <strong>{t("quoteName")}</strong>
          <em>{t("quoteRole")}</em>
        </div>
      </figcaption>
    </figure>
  );
}
