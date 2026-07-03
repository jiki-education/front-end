"use client";

import { useTranslations } from "next-intl";
import { hideModal } from "../store";

interface ExampleModalProps {
  title?: string;
  message?: string;
}

export function ExampleModal({ title, message }: ExampleModalProps) {
  const t = useTranslations("modals.example");
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">{title ?? t("defaultTitle")}</h2>
      <p className="text-gray-600">{message ?? t("defaultMessage")}</p>
      <div className="flex gap-2 justify-end mt-6">
        <button
          onClick={hideModal}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          {t("cancel")}
        </button>
        <button
          onClick={() => {
            // Example modal action would go here
            hideModal();
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {t("confirm")}
        </button>
      </div>
    </div>
  );
}
