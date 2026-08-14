import { useTranslations } from "next-intl";
import { FORUM_TRANSLATE_URL } from "@/lib/constants/social";
import ArrowIcon from "@/icons/arrow-right.svg";
import styles from "./LanguageField.module.css";

/**
 * Sits outside the scroller, so the invitation stays visible rather than waiting
 * at the bottom of 33 rows — it is most wanted by exactly the person who just
 * found their language missing.
 */
export default function TranslationFootnote() {
  const t = useTranslations("settings.language");

  return (
    <p className={styles.footnote}>
      {t("communityNote")}{" "}
      <a href={FORUM_TRANSLATE_URL} target="_blank" rel="noopener noreferrer">
        {t("helpTranslate")}
        <ArrowIcon className={styles.footnoteArrow} width={14} height={14} aria-hidden="true" />
      </a>
    </p>
  );
}
