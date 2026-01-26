"use client";

import { CloseButton } from "@/components/ui-kit";
import { assembleClassNames } from "@/lib/assemble-classnames";
import { showConfirmation } from "@/lib/modal";
import { useRouter } from "next/navigation";

interface LessonQuitButtonProps {
  onQuit?: () => void;
  className?: string;
  variant?: "default" | "light";
}

export function LessonQuitButton({ onQuit, className = "", variant = "light" }: LessonQuitButtonProps) {
  const router = useRouter();

  const handleQuit = () => {
    showConfirmation({
      title: "Quit Lesson",
      message: "Are you sure you want to quit this lesson? Your progress won't be saved.",
      confirmText: "Quit",
      cancelText: "Continue Learning",
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
      className={assembleClassNames(className, "absolute top-[16px] right-[16px]")}
      aria-label="Quit lesson"
    />
  );
}
