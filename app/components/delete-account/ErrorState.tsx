import { useTranslations } from "next-intl";
import { ApiErrorMessage } from "@/lib/api/apiErrors";
import DeleteAccountLayout from "./DeleteAccountLayout";
import ErrorRobot from "./robots/ErrorRobot";
import styles from "./states.module.css";

// `error` is passed when the API named a reason we have specific copy for
// (e.g. `stripe_error`, which means the subscription could not be cancelled);
// otherwise the generic subtitle stands.
export default function ErrorState({ error }: { error?: unknown }) {
  const t = useTranslations("misc.deleteAccount");
  return (
    <DeleteAccountLayout>
      <ErrorRobot />
      <h1 className={styles.titleError}>{t("errorTitle")}</h1>
      <p className={styles.subtitle}>
        {error == null ? t("errorSubtitle") : <ApiErrorMessage error={error} context="accountDeletion" />}
      </p>
    </DeleteAccountLayout>
  );
}
