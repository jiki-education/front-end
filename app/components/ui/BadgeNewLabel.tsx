import { useTranslations } from "next-intl";
import styles from "./BadgeNewLabel.module.css";

interface BadgeNewLabelProps {
  className?: string;
}

export function BadgeNewLabel({ className }: BadgeNewLabelProps) {
  const t = useTranslations("common.badgeNewLabel");
  return <div className={`${styles.newLabel} ${className || ""}`}>{t("label")}</div>;
}
