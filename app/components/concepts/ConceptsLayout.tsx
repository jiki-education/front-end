import { useEffect } from "react";
import styles from "@/app/styles/modules/concepts.module.css";

interface ConceptsLayoutProps {
  children: React.ReactNode;
}

export default function ConceptsLayout({ children }: ConceptsLayoutProps) {
  useEffect(() => {
    // Force scrollbar to always show on concepts page
    document.documentElement.style.overflowY = "scroll";

    return () => {
      // Reset when leaving the page
      document.documentElement.style.overflowY = "";
    };
  }, []);

  return (
    <div className={styles.mainContent}>
      <div className={styles.container}>{children}</div>
    </div>
  );
}
