import Link from "next/link";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import styles from "./BetaTag.module.css";

export default function BetaTag() {
  const routes = useLocaleRoutes();
  return (
    <Link href={routes.article("beta-phase")} className={styles.tag}>
      Beta Version
    </Link>
  );
}
