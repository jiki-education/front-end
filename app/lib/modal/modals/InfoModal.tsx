"use client";

import { useTranslations } from "next-intl";
import { hideModal } from "../store";

interface InfoModalProps {
  title?: string;
  content?: string | React.ReactNode;
  buttonText?: string;
}

export function InfoModal({ title, content = "", buttonText }: InfoModalProps) {
  const t = useTranslations("modals.info");
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">{title ?? t("defaultTitle")}</h2>
      <div className="text-gray-600">{typeof content === "string" ? <p>{content}</p> : content}</div>
      <div className="flex justify-center mt-6">
        <button
          onClick={hideModal}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {buttonText ?? t("defaultButton")}
        </button>
      </div>
    </div>
  );
}
