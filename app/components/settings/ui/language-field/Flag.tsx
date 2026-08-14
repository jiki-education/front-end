import { staticAsset } from "@/lib/static-asset";
import type { Language } from "@/lib/i18n/languages";
import styles from "./LanguageField.module.css";

export default function Flag({ language }: { language: Language }) {
  // Plain <img> rather than next/image: tiny static SVGs from the hashed asset
  // tree, so there is nothing for the optimizer to do.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={staticAsset(`images/flags/${language.flag}.svg`)} alt="" aria-hidden="true" className={styles.flag} />
  );
}
