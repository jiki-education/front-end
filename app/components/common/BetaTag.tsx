import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import styles from "./BetaTag.module.css";

export default function BetaTag() {
  const routes = useLocaleRoutes();
  const t = useTranslations("common.betaTag");
  return (
    <Link href={routes.article("beta-phase")} className={styles.tag}>
      {t("label")}
    </Link>
  );
}
