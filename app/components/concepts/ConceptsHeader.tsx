"use client";

import { useTranslations } from "next-intl";
import styles from "@/app/styles/modules/concepts.module.css";
import FolderIcon from "@/icons/folder.svg";
import Breadcrumb from "./Breadcrumb";

export default function ConceptsHeader() {
  const t = useTranslations("concepts.list");
  return (
    <header>
      <Breadcrumb />

      <h1 className={styles.pageHeading}>
        <FolderIcon className={styles.headingIcon} />
        {t("heading")}
      </h1>
    </header>
  );
}
