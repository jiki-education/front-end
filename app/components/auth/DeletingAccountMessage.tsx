import styles from "./AccountDeletedMessage.module.css";

export function DeletingAccountMessage() {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>JIKI</div>

      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-6"></div>

      <h1 className={styles.title}>Deleting account...</h1>
      <p className={styles.subtitle}>Please wait while we delete your account.</p>
    </div>
  );
}
