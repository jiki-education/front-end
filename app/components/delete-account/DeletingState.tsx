import AnimatedDots from "@/components/ui/AnimatedDots";
import DeleteAccountLayout from "./DeleteAccountLayout";
import styles from "./states.module.css";

export default function DeletingState() {
  return (
    <DeleteAccountLayout>
      <div className={styles.spinner} />
      <h1 className={styles.title}>Deleting your account</h1>
      <p className={styles.subtitle}>
        Please wait
        <AnimatedDots />
      </p>
    </DeleteAccountLayout>
  );
}
