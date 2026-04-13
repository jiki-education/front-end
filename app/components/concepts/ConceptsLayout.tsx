import { useEffect } from "react";
import styles from "@/app/styles/modules/concepts.module.css";
import { useAuthStore } from "../../lib/auth/authStore";

interface ConceptsLayoutProps {
  children: React.ReactNode;
}

export default function ConceptsLayout({ children }: ConceptsLayoutProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Force scrollbar to always show on concepts page
    document.documentElement.style.overflowY = "scroll";

    return () => {
      // Reset when leaving the page
      document.documentElement.style.overflowY = "";
    };
  }, []);

  return (
    <div className={[styles.mainContent, isAuthenticated ? styles.internalContent : styles.externalContent].join(" ")}>
      <div className={styles.container}>{children}</div>
    </div>
  );
}
