import styles from "./EditableField.module.css";

interface ActionFieldProps {
  label: string;
  description: string;
  children: React.ReactNode;
}

export default function ActionField({ label, description, children }: ActionFieldProps) {
  return (
    <div className={styles.header}>
      <div className={styles.labelGroup}>
        <span className={styles.label}>{label}</span>
        <div className={styles.value}>{description}</div>
      </div>
      {children}
    </div>
  );
}
