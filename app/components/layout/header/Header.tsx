"use client";

import shared from "@/components/landing-page/shared.module.css";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { staticAsset } from "@/lib/static-asset";
import { Buttons } from "./Buttons";
import { HeaderHeightSync } from "./HeaderHeightSync";
import styles from "./Header.module.css";

// The public header shell. Client-safe on purpose: it imports nothing
// server-only, so both the server HeaderLayout and the client SidebarLayout can
// render it. The locale banner is server-rendered (it reads request headers), so
// it's passed in as a slot by server parents rather than imported here.
export default function Header({ banner }: { banner?: React.ReactNode }) {
  const t = useTranslations("layout.internalHeader");

  return (
    <header className={styles.header}>
      {banner}
      <div className={`${shared["lg-container"]} ${styles.inner}`}>
        <Link href="/" aria-label={t("homeAriaLabel")} className={styles.logoLink}>
          <Image
            src={staticAsset("images/logo-peeking.webp")}
            alt={t("logoAlt")}
            width={100}
            height={40}
            className={styles.logo}
            priority
          />
        </Link>

        <Buttons />
      </div>
      <HeaderHeightSync />
    </header>
  );
}
