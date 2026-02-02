import DeleteAccountLayout from "./DeleteAccountLayout";
import SadRobot from "./robots/SadRobot";
import styles from "./states.module.css";

export default function DeletedState() {
  return (
    <DeleteAccountLayout>
      <SadRobot />
      <h1 className={styles.title}>Your account has been deleted</h1>
      <p className={styles.subtitle}>
        We&apos;re sorry to see you go. We hope you&apos;ve enjoyed Jiki. Good luck with your coding journey!
      </p>
    </DeleteAccountLayout>
  );
}
