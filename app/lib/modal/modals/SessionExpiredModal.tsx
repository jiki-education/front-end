"use client";

import { useTranslations } from "next-intl";

interface SessionExpiredModalProps {
  error?: Error;
}

export function SessionExpiredModal({ error: _error }: SessionExpiredModalProps) {
  const t = useTranslations("modals.sessionExpired");
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="space-y-4 max-w-md">
      <h2 className="text-xl font-semibold text-text-primary">{t("title")}</h2>
      <p className="text-text-secondary">{t("description")}</p>
      <div className="flex justify-center mt-6">
        <button
          onClick={handleReload}
          className="px-6 py-2 bg-button-primary-bg text-button-primary-text rounded hover:opacity-90 transition-opacity focus-ring"
        >
          {t("reload")}
        </button>
      </div>
    </div>
  );
}
