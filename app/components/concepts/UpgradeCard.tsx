import Image from "next/image";
import Link from "next/link";
import styles from "./UpgradeCard.module.css";

export function UpgradeCard() {
  return (
    <div className={styles.card}>
      <div className={styles.row}>
        <Image src="/static/images/jiki-logo.png" alt="Jiki" width={56} height={56} className={styles.logo} />
        <div className={styles.heading}>
          Start your <span className={styles.highlight}>coding journey</span> today!
        </div>
      </div>
      <p className={styles.text}>
        Sign up to Jiki and learn to code with interactive exercises, real projects, and personalised support. Best of
        all, <span className={styles.free}>it&apos;s free!</span>
      </p>
      <Link href="/auth/signup" className="ui-btn ui-btn-small ui-btn-primary" style={{ width: "100%" }}>
        Sign Up
      </Link>
    </div>
  );
}
