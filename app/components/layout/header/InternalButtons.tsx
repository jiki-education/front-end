import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import { useTranslations } from "next-intl";
import Link from "next/link";
import styles from "./InternalButtons.module.css";

export default function InternalButtons() {
  const t = useTranslations("layout.internalHeader");
  const routes = useLocaleRoutes();

  return (
    <>
      <div className={styles.buttons}>
        <Link href={routes.dashboard()} className="ui-btn ui-btn-small ui-btn-primary">
          {t("backToJiki")}
        </Link>
      </div>
    </>
  );
}
