import styles from "./PremiumPage.module.css";

interface Props {
  label: string;
}

export default function CategoryRow({ label }: Props) {
  return (
    <div className={styles["category-row"]}>
      <div className={styles["category-label"]}>{label}</div>
      <div />
      <div className={styles["category-col-spacer-premium"]} />
    </div>
  );
}
