import styles from "@/app/styles/modules/concepts.module.css";

interface ConceptsLayoutProps {
  children: React.ReactNode;
}

export default function ConceptsLayout({ children }: ConceptsLayoutProps) {
  return (
    <div className={styles.mainContent}>
      <div className={styles.container}>{children}</div>
    </div>
  );
}
