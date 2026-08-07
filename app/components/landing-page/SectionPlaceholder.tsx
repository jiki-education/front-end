import styles from "./SectionPlaceholder.module.css";

/**
 * A grey block standing in for a section still to be built. Deliberately plain and not
 * translated, since none of it ships: it exists so the page reads in the right order
 * while the real thing is in progress.
 */
export function SectionPlaceholder({ label, height = "420px" }: { label: string; height?: string }) {
  return (
    <div className={styles.placeholder} style={{ minHeight: height }}>
      {label} — to come
    </div>
  );
}
