import { useTranslations } from "next-intl";
import SearchIcon from "@/icons/search.svg";
import styles from "./LanguageField.module.css";

interface LanguageSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function LanguageSearch({ value, onChange }: LanguageSearchProps) {
  const t = useTranslations("settings.language");

  return (
    <div className={styles.searchRow}>
      <SearchIcon className={styles.searchIcon} width={16} height={16} aria-hidden="true" />
      <input
        type="search"
        className={styles.search}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t("searchPlaceholder")}
        aria-label={t("searchLabel")}
        autoComplete="off"
        autoFocus
      />
    </div>
  );
}
