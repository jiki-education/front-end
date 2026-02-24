"use client";

import { useRef, useState } from "react";
import { hideModal, showModal, showConfirmation } from "@/lib/modal/store";
import { uploadAvatar, deleteAvatar } from "@/lib/api/profile";
import { validateImageFile } from "@/lib/utils/validateImageFile";
import { ApiError } from "@/lib/api/client";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AvatarPreview from "../ui/AvatarPreview";

interface AvatarEditModalProps {
  avatarUrl: string | null;
  onAvatarChange: (url: string | null) => void;
}

export function AvatarEditModal({ avatarUrl, onAvatarChange }: AvatarEditModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deleting, setDeleting] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) {
      return;
    }
    const validationError = validateImageFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    const imageSrc = URL.createObjectURL(file);
    hideModal();
    setTimeout(() => {
      showModal("avatar-crop-modal", {
        imageSrc,
        onCrop: (blob: Blob) => {
          URL.revokeObjectURL(imageSrc);
          void performUpload(blob);
        }
      });
    }, 100);
  };

  const performUpload = async (blob: Blob) => {
    try {
      const response = await uploadAvatar(blob);
      onAvatarChange(response.profile.avatar_url || null);
      toast.success("Avatar updated");
    } catch (err) {
      toast.error(err instanceof ApiError ? "Failed to upload avatar" : "Network error. Please try again.");
    }
  };

  const handleRemove = () => {
    hideModal();
    setTimeout(() => {
      showConfirmation({
        title: "Remove Avatar",
        message: "Are you sure you want to remove your avatar?",
        confirmText: "Remove",
        variant: "danger",
        onConfirm: () => void performDelete()
      });
    }, 100);
  };

  const performDelete = async () => {
    setDeleting(true);
    try {
      const response = await deleteAvatar();
      onAvatarChange(response.profile.avatar_url || null);
      toast.success("Avatar removed");
    } catch {
      toast.error("Failed to remove avatar");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-24 max-w-sm mx-auto text-center">
      <h2 className="text-xl font-bold mb-16">Profile Photo</h2>
      <div className="flex justify-center mb-20">
        <AvatarPreview url={avatarUrl} size="lg" />
      </div>
      <div className="flex flex-col gap-12">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={deleting}
          className="ui-btn ui-btn-primary ui-btn-small"
        >
          Upload new photo
        </button>
        {avatarUrl && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={deleting}
            className="ui-btn ui-btn-secondary ui-btn-small"
          >
            {deleting ? <LoadingSpinner size="sm" /> : "Remove photo"}
          </button>
        )}
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
