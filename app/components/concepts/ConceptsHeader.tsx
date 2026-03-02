"use client";

import styles from "@/app/styles/modules/concepts.module.css";
import FolderIcon from "@/icons/folder.svg";
import Breadcrumb from "./Breadcrumb";

export default function ConceptsHeader() {
  return (
    <header>
      <Breadcrumb />

      <h1 className={styles.pageHeading}>
        <FolderIcon className={styles.headingIcon} />
        Concept Library
      </h1>
    </header>
  );
}
