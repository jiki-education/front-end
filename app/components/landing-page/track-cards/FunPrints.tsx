"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { staticAsset } from "@/lib/static-asset";
import headingArrow from "../assets/heading-arrow-loop.png";
import styles from "./FunPrints.module.css";

// `pixel` marks the deliberately pixel-art clips, which keep their colours; the rest get
// a faint print wash so they read as photographs pinned to the page.
const PRINTS = [
  { key: "spaceInvaders", file: "space-invaders-74644.mp4", pixel: true },
  { key: "ticTacToe", file: "tic-tac-toe-736a8.mp4", pixel: false },
  { key: "breakout", file: "breakout-bcaa3.mp4", pixel: true },
  { key: "mazeSolver", file: "maze-59a6d.mp4", pixel: false },
  { key: "flowerFlipbook", file: "flower-22e43.mp4", pixel: false }
] as const;

export function FunPrints() {
  const t = useTranslations("landing.funPrints");

  return (
    <div className={styles.band}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{t("eyebrow")}</p>

        <div className={styles.headingWrap}>
          <h2 className={styles.heading}>{t("heading")}</h2>
          <Image className={styles.headingArrow} src={headingArrow} alt="" aria-hidden="true" />
        </div>

        <p className={styles.sub}>{t.rich("sub", { strong: (chunks) => <strong>{chunks}</strong> })}</p>

        <ul className={styles.grid}>
          {PRINTS.map(({ key, file, pixel }) => (
            <li key={key}>
              <video
                className={pixel ? styles.pixel : undefined}
                aria-label={t(key)}
                src={staticAsset(`images/landing-page/${file}`)}
                autoPlay
                loop
                muted
                playsInline
              />
              <span>{t(key)}</span>
            </li>
          ))}
        </ul>

        <p className={styles.footnote}>{t("footnote")}</p>
      </div>
    </div>
  );
}
