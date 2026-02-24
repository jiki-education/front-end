"use client";

import { useState, useEffect } from "react";
import { fetchProfile } from "@/lib/api/profile";
import { showModal } from "@/lib/modal/store";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AvatarPreview from "../ui/AvatarPreview";
import PencilIcon from "@/icons/pencil.svg";
import fieldStyles from "../ui/EditableField.module.css";
import styles from "../Settings.module.css";

export default function AvatarUploadSection() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAvatar() {
      try {
        const response = await fetchProfile();
        setAvatarUrl(response.profile.avatar_url || null);
      } catch {
        // Profile fetch is best-effort; section still renders
      } finally {
        setLoading(false);
      }
    }
    void loadAvatar();
  }, []);

  const handleClick = () => {
    showModal("avatar-edit-modal", {
      avatarUrl,
      onAvatarChange: (url: string | null) => {
        setAvatarUrl(url);
      }
    });
  };

  if (loading) {
    return (
      <div className={styles.settingsField}>
        <div className="flex items-center justify-center py-4">
          <LoadingSpinner size="sm" />
        </div>
      </div>
    );
  }

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
