import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  label: string;
  title: string;
  subtitle: string;
}

export default function PageHeader({ label, title, subtitle }: PageHeaderProps) {
  return (
    <div className={styles.pageHeader}>
      <p className={styles.pageLabel}>{label}</p>
      <h1 className={styles.pageTitle}>{title}</h1>
      <p className={styles.pageSubtitle}>{subtitle}</p>
    </div>
  );
}
