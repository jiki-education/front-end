import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import { staticAsset } from "@/lib/static-asset";
import styles from "./UpgradeCard.module.css";

export function UpgradeCard() {
  const routes = useLocaleRoutes();
  const t = useTranslations("concepts.upgradeCard");
  return (
    <div className={styles.card}>
      <div className={styles.row}>
        <Image
          src={staticAsset("images/jiki-face.png")}
          alt={t("logoAlt")}
          width={56}
          height={56}
          className={styles.logo}
        />
        <div className={styles.heading}>
          {t.rich("heading", {
            highlight: (chunks) => <span className={styles.highlight}>{chunks}</span>
          })}
        </div>
      </div>
      <p className={styles.text}>
        {t.rich("text", {
          free: (chunks) => <span className={styles.free}>{chunks}</span>
        })}
      </p>
      <Link href={routes.authSignup()} className="ui-btn ui-btn-small ui-btn-primary" style={{ width: "100%" }}>
        {t("button")}
      </Link>
    </div>
  );
}
