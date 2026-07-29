"use client";

import { useTranslations } from "next-intl";
import { showAvatarEditModal } from "@/lib/modal/app";
import { useAuthStore } from "@/lib/auth/authStore";
import AvatarPreview from "../ui/AvatarPreview";
import PencilIcon from "@/icons/pencil.svg";
import fieldStyles from "../ui/EditableField.module.css";
import styles from "../Settings.module.css";
import sectionStyles from "./AvatarUploadSection.module.css";

export default function AvatarUploadSection() {
  const t = useTranslations("settings.avatarUpload");
  const avatarUrl = useAuthStore((state) => state.user?.avatar_url ?? null);

  const handleClick = () => {
    showAvatarEditModal();
  };

  return (
    <div className={styles.settingsField}>
      <div className={fieldStyles.labelGroup}>
        <span className={fieldStyles.label}>{t("label")}</span>
        <button type="button" onClick={handleClick} className={sectionStyles.avatarButton}>
          <AvatarPreview url={avatarUrl} size="sm" />
          <div className={sectionStyles.overlay}>
            <PencilIcon className={sectionStyles.pencilIcon} />
          </div>
        </button>
      </div>
    </div>
  );
}
