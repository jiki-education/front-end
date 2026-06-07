import Link from "next/link";
import styles from "./BetaTag.module.css";

export default function BetaTag() {
  return (
    <Link href="/articles/beta-phase" className={styles.tag}>
      Beta Version
    </Link>
  );
}
