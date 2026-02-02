import Link from "next/link";
import DeleteAccountLayout from "./DeleteAccountLayout";
import ErrorRobot from "./robots/ErrorRobot";
import styles from "./states.module.css";

export default function ExpiredLinkState() {
  return (
    <DeleteAccountLayout>
      <ErrorRobot />
      <h1 className={styles.titleError}>Link expired or invalid</h1>
      <p className={styles.subtitle}>
        This deletion link is no longer valid. It may have already been used or has expired.
      </p>
      <p className={styles.subtitleSecondary}>
        If you still want to delete your account, please log in and request a new deletion link from your settings.
      </p>
      <Link href="/" className={styles.homeLink}>
        Go to homepage
      </Link>
    </DeleteAccountLayout>
  );
}
