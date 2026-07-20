"use client";

import NoResultsIcon from "@/icons/no-results.svg";
import { useTranslations } from "next-intl";
import styles from "@/components/concepts/ConceptsSearch.module.css";
import errorStyles from "./ErrorStates.module.css";
import { useAuthStore } from "@/lib/auth/authStore";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const tCommon = useTranslations("common");

  if (isAuthenticated) {
    return (
      <div className={errorStyles.authWrapper} data-testid="error-state" data-variant="sidebar">
        <div className={errorStyles.center}>
          <div className={errorStyles.errorMessage}>{error}</div>
          <button onClick={onRetry} className={`${errorStyles.retryButton} focus-ring`}>
            {tCommon("tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={errorStyles.guestWrapper} data-testid="error-state" data-variant="full">
      <div className={errorStyles.center}>
        <div className={errorStyles.guestMessage}>{error}</div>
        <button onClick={onRetry} className={errorStyles.guestButton}>
          {tCommon("tryAgain")}
        </button>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  debouncedSearchQuery: string;
}

export function EmptyState({ debouncedSearchQuery }: EmptyStateProps) {
  const t = useTranslations("concepts.list");
  if (!debouncedSearchQuery) {
    return null;
  }

  return (
    <div className={styles.noResults}>
      <NoResultsIcon className={styles.noResultsIcon} />
      <div className={styles.noResultsTitle}>
        {t.rich("noResultsTitle", {
          query: () => <span className={styles.noResultsQuery}>{debouncedSearchQuery}</span>
        })}
      </div>
      <div className={styles.noResultsMessage}>{t("noResultsMessage")}</div>
    </div>
  );
}
