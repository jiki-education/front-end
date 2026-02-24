"use client";

import { useState, useEffect, useRef } from "react";
import { fetchProfile, uploadAvatar, deleteAvatar } from "@/lib/api/profile";
import { showModal, showConfirmation } from "@/lib/modal/store";
import { ApiError } from "@/lib/api/client";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import styles from "../Settings.module.css";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function AvatarUploadSection() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset input so the same file can be re-selected
    e.target.value = "";

    if (!file) {
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Please select a JPEG, PNG, GIF, or WebP image");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image must be less than 5MB");
      return;
    }

    const imageSrc = URL.createObjectURL(file);
    showModal("avatar-crop-modal", {
      imageSrc,
      onCrop: (blob: Blob) => {
        URL.revokeObjectURL(imageSrc);
        void handleUpload(blob);
      }
    });
  };

  const handleUpload = async (blob: Blob) => {
    setUploading(true);
    try {
      const response = await uploadAvatar(blob);
      setAvatarUrl(response.profile.avatar_url || null);
      toast.success("Avatar updated");
    } catch (error) {
      const message = error instanceof ApiError ? "Failed to upload avatar" : "Network error. Please try again.";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const performDelete = async () => {
    setDeleting(true);
    try {
      const response = await deleteAvatar();
      setAvatarUrl(response.profile.avatar_url || null);
      toast.success("Avatar removed");
    } catch {
      toast.error("Failed to remove avatar");
    } finally {
      setDeleting(false);
    }
  };

  const handleDelete = () => {
    showConfirmation({
      title: "Remove Avatar",
      message: "Are you sure you want to remove your avatar?",
      confirmText: "Remove",
      variant: "danger",
      onConfirm: () => {
        void performDelete();
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
      <div className="flex items-center gap-16">
        <AvatarPreview url={avatarUrl} uploading={uploading} />
        <div className="flex flex-col gap-8">
          <p className="text-sm font-medium text-[--color-gray-800]">Profile Photo</p>
          <div className="flex gap-8">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || deleting}
              className="ui-btn ui-btn-primary ui-btn-small"
            >
              {uploading ? <LoadingSpinner size="sm" /> : "Upload"}
            </button>
            {avatarUrl && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={uploading || deleting}
                className="ui-btn ui-btn-secondary ui-btn-small"
              >
                {deleting ? <LoadingSpinner size="sm" /> : "Remove"}
              </button>
            )}
          </div>
          <p className="text-xs text-[--color-gray-500]">JPEG, PNG, GIF, or WebP. Max 5MB.</p>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

function AvatarPreview({ url, uploading }: { url: string | null; uploading: boolean }) {
  if (uploading) {
    return (
      <div className="w-80 h-80 rounded-full bg-[--color-gray-100] flex items-center justify-center flex-shrink-0">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (url) {
    return (
      // Avatar URL is dynamic from the backend API
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt="Your avatar" className="w-80 h-80 rounded-full object-cover flex-shrink-0" />
    );
  }

  return (
    <div className="w-80 h-80 rounded-full bg-[--color-gray-100] flex items-center justify-center flex-shrink-0">
      <svg className="w-32 h-32 text-[--color-gray-400]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  );
}
