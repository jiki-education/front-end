"use client";

import { useTranslations } from "next-intl";
import { hideModal } from "../store";

interface ExerciseSuccessModalProps {
  title?: string;
  message?: string;
  buttonText?: string;
}

export function ExerciseSuccessModal({ title, message, buttonText }: ExerciseSuccessModalProps) {
  const t = useTranslations("modals.exerciseSuccess");
  const tCommon = useTranslations("common");
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-green-700">{title ?? t("defaultTitle")}</h2>
      <div className="text-gray-600">
        <p>{message ?? t("defaultMessage")}</p>
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={hideModal}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          {buttonText ?? tCommon("continue")}
        </button>
      </div>
    </div>
  );
}
