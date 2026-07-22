import styles from "./LoadingSpinner.module.css";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={`${styles.spinner} ${styles[size]}`} />
    </div>
  );
}
