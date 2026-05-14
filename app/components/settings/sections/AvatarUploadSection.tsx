"use client";

import { showModal } from "@/lib/modal/store";
import { useAuthStore } from "@/lib/auth/authStore";
import AvatarPreview from "../ui/AvatarPreview";
import PencilIcon from "@/icons/pencil.svg";
import fieldStyles from "../ui/EditableField.module.css";
import styles from "../Settings.module.css";

export default function AvatarUploadSection() {
  const avatarUrl = useAuthStore((state) => state.user?.avatar_url ?? null);

  const handleClick = () => {
    showModal("avatar-edit-modal", {});
  };

  return (
    <div className={styles.settingsField}>
      <div className={fieldStyles.labelGroup}>
        <span className={fieldStyles.label}>Profile Photo</span>
        <button type="button" onClick={handleClick} className="cursor-pointer self-start group relative">
          <AvatarPreview url={avatarUrl} size="sm" />
          <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <PencilIcon className="w-24 h-24 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </button>
      </div>
    </div>
  );
}
