import styles from "./instructions-panel/instructions-panel.module.css";

export function PanelHeader({ title, description }: { title: string; description: string | React.ReactNode }) {
  return (
    <div className={styles.panelHeader}>
      <h2 className="">{title}</h2>
      <p className="">{description}</p>
    </div>
  );
}
