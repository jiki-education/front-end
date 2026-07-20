"use client";

import { CloseButton } from "@/components/ui-kit";
import { assembleClassNames } from "@/lib/assemble-classnames";
import { showConfirmation } from "@/lib/modal";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface LessonQuitButtonProps {
  onQuit?: () => void;
  className?: string;
  variant?: "default" | "light" | "glass";
}

export function LessonQuitButton({ onQuit, className = "", variant = "light" }: LessonQuitButtonProps) {
  const router = useRouter();
  const t = useTranslations("lesson.quitButton");

  const handleQuit = () => {
    showConfirmation({
      title: t("title"),
      message: t("message"),
      confirmText: t("confirm"),
      cancelText: t("cancel"),
      variant: "danger",
      onConfirm: () => {
        if (onQuit) {
          onQuit();
        } else {
          router.push("/");
        }
      }
    });
  };

  return (
    <CloseButton
      onClick={handleQuit}
      variant={variant}
      className={assembleClassNames(className, "absolute top-[16px] end-[16px]")}
      aria-label={t("ariaLabel")}
    />
  );
}
