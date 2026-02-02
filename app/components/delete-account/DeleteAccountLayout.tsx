import type { ReactNode } from "react";
import styles from "./DeleteAccountLayout.module.css";

interface DeleteAccountLayoutProps {
  children: ReactNode;
}

export default function DeleteAccountLayout({ children }: DeleteAccountLayoutProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.logo}>JIKI</div>
        {children}
      </div>
    </div>
  );
}
