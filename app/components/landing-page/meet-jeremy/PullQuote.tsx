"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import thom from "../assets/testimonials/thom.webp";
import styles from "./PullQuote.module.css";

// The one testimonial that closes the section off, under a rule.
export function PullQuote() {
  const t = useTranslations("landing.meetJeremy");

  return (
    <figure className={styles.quote}>
      <span className={styles.mark} aria-hidden="true">
        &ldquo;
      </span>
      <blockquote>{t.rich("quote", { strong: (chunks) => <strong>{chunks}</strong> })}</blockquote>
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
