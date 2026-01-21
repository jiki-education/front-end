import styles from "./BadgeNewLabel.module.css";

interface BadgeNewLabelProps {
  className?: string;
}

export function BadgeNewLabel({ className }: BadgeNewLabelProps) {
  return <div className={`${styles.newLabel} ${className || ""}`}>NEW</div>;
}
