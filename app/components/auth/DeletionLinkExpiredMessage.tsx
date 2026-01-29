import Link from "next/link";
import ShieldXIcon from "@/icons/shield-x.svg";
import styles from "./AccountDeletedMessage.module.css";
import errorStyles from "./DeletionLinkExpiredMessage.module.css";

export function DeletionLinkExpiredMessage() {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>JIKI</div>

      <div className={errorStyles.iconContainer}>
        <ShieldXIcon />
      </div>

      <h1 className={styles.title}>Link expired or invalid</h1>
      <p className={styles.subtitle}>
        This deletion link is no longer valid. It may have already been used or has expired.
      </p>
      <p className={styles.subtitle} style={{ marginTop: "8px" }}>
        If you still want to delete your account, please log in and request a new deletion link from your settings.
      </p>

      <Link href="/" className={errorStyles.homeLink}>
        Go to homepage
      </Link>
    </div>
  );
}
