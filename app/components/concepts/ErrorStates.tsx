"use client";

import NoResultsIcon from "@/icons/no-results.svg";
import { useTranslations } from "next-intl";
import styles from "@/components/concepts/ConceptsSearch.module.css";
import { useAuthStore } from "@/lib/auth/authStore";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const t = useTranslations("concepts.list");

  if (isAuthenticated) {
    return (
      <div className="ml-[260px] p-6">
        <div className="text-center">
          <div className="mb-4 text-error-text text-lg">{error}</div>
          <button
            onClick={onRetry}
            className="rounded-md bg-button-primary-bg px-4 py-2 text-button-primary-text hover:opacity-90 focus-ring"
          >
            {t("tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="text-center">
        <div className="mb-4 text-red-600 text-lg">{error}</div>
        <button onClick={onRetry} className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          {t("tryAgain")}
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
