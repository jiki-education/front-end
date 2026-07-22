"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { staticAsset } from "@/lib/static-asset";
import styles from "./AuthLayout.module.css";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const t = useTranslations("auth.layout");

  return (
    <div className={styles.layout}>
      {children}

      {/* Right Side - Gradient Background */}
      <div className={styles.rightSide}>
        <Image
          src={staticAsset("images/jiki-word.png")}
          alt={t("logoAlt")}
          width={206}
          height={96}
          className={styles.logoLarge}
          priority
        />
        <h1 className={styles.tagline}>{t("tagline")}</h1>
        <p className={styles.description}>{t("description")}</p>

        <div className={styles.creatorsBadge}>
          <div className={styles.label}>{t("createdBy")}</div>
          <div className={styles.brand}>{t("brand")}</div>
        </div>
      </div>
    </div>
  );
}
