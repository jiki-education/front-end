import DeleteAccountLayout from "./DeleteAccountLayout";
import ErrorRobot from "./robots/ErrorRobot";
import styles from "./states.module.css";

export default function ErrorState() {
  return (
    <DeleteAccountLayout>
      <ErrorRobot />
      <h1 className={styles.titleError}>There&apos;s been an error</h1>
      <p className={styles.subtitle}>
        There has been an error deleting your account. We have been notified and will delete it manually for you.
      </p>
    </DeleteAccountLayout>
  );
}
