import styles from "./AnimatedDots.module.css";

interface AnimatedDotsProps {
  className?: string;
}

export default function AnimatedDots({ className }: AnimatedDotsProps) {
  return <span className={`${styles.dots} ${className ?? ""}`} />;
}
