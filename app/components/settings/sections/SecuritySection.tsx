"use client";

import PasswordField from "../ui/PasswordField";
import styles from "../Settings.module.css";

interface SecuritySectionProps {
  updatePassword: (newPassword: string, sudoPassword: string) => Promise<void>;
}

export default function SecuritySection({ updatePassword }: SecuritySectionProps) {
  return (
    <div className={styles.accountField}>
      <PasswordField onSave={updatePassword} />
    </div>
  );
}
