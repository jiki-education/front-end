import styles from "./PageHeader.module.css";

export default function PageHeader() {
  return (
    <div className={styles.pageHeader}>
      <p className={styles.pageLabel}>Blog</p>
      <h1 className={styles.pageTitle}>News, insights and witterings</h1>
      <p className={styles.pageSubtitle}>
        Deep dives into programming languages, coding challenges, and the art of learning to code.
      </p>
    </div>
  );
}
