import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import styles from "./BetaTag.module.css";

export default function BetaTag() {
  const t = useTranslations("common");
  const routes = useLocaleRoutes();
  return (
    <Link href={routes.article("beta-phase")} className={styles.tag}>
      {t("betaTag")}
    </Link>
  );
}
