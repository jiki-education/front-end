import styles from "@/app/styles/modules/concepts.module.css";
import Sidebar from "@/components/layout/sidebar/Sidebar";

interface ConceptsLayoutProps {
  children: React.ReactNode;
  withSidebar: boolean;
}

export default function ConceptsLayout({ children, withSidebar }: ConceptsLayoutProps) {
  if (withSidebar) {
    return (
      <div className="min-h-screen">
        <Sidebar activeItem="concepts" />
        <div className={styles.mainContent}>
          <div className={styles.container}>{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mainContent}>
      <div className={styles.container}>{children}</div>
    </div>
  );
}
