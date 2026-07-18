"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { staticAsset } from "@/lib/static-asset";
import AnimatedDots from "./AnimatedDots";
import styles from "./LoadingJiki.module.css";

interface LoadingJikiProps {
  delayed?: boolean;
}

export default function LoadingJiki({ delayed = false }: LoadingJikiProps) {
  const t = useTranslations("layout.loading");

  return (
    <div className={`${styles.container} ${delayed ? styles.delayed : ""}`}>
      <div className={styles.imageWrapper}>
        <Image
          src={staticAsset("images/graphics/jiki-wakeup.webp")}
          alt="Jiki character waking up"
          width={560}
          height={560}
          priority
        />
      </div>

      <div className={styles.text}>
        <h1 className={styles.title}>
          {t("title")}
          <AnimatedDots />
        </h1>
        <p className={styles.subtitle}>{t("subtitle")}</p>
      </div>
    </div>
  );
}
