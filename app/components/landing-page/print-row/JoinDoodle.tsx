"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import joinLoop from "../assets/join-loop-dashed.webp";
import styles from "./JoinDoodle.module.css";

/**
 * The looping dashed arrow and its handwritten aside, as one piece.
 *
 * The artwork ends on an open dash, so the arrowhead is a separate shape placed on the
 * end of it. Everything here is positioned as a percentage of the artwork, so the head
 * and the note stay put whatever width the doodle is given, and wherever it is placed.
 */
export function JoinDoodle() {
  const t = useTranslations("landing.printRow");

  return (
    <div className={styles.doodle} aria-hidden="true">
      <span className={styles.note}>{t("joinNote")}</span>
      <Image src={joinLoop} alt="" className={styles.path} />
      <svg className={styles.head} viewBox="0 0 24 20">
        <path d="M23 10 L3 18 L7.5 10 L3 2 Z" fill="currentColor" />
      </svg>
    </div>
  );
}
