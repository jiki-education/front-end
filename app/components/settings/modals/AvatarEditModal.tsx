"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { hideModal } from "@/lib/modal/store";
import { uploadAvatar } from "@/lib/api/profile";
import { validateImageFile } from "@/lib/utils/validateImageFile";
import { getCroppedImage } from "@/lib/utils/cropImage";
import { useProfileStore } from "@/lib/profile/profileStore";
import { ApiError } from "@/lib/api/client";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import UploadIcon from "@/icons/upload.svg";
import ZoomOutIcon from "@/icons/zoom-out.svg";
import ZoomInIcon from "@/icons/zoom-in.svg";
import styles from "./AvatarEditModal.module.css";

interface AvatarEditModalProps {
  onAvatarChange: (url: string | null) => void;
}

export function AvatarEditModal({ onAvatarChange }: AvatarEditModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const setAvatarUrl = useProfileStore((state) => state.setAvatarUrl);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [cropSize, setCropSize] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!imageSrc || !containerRef.current) {
      return;
    }
    const observer = new ResizeObserver((entries) => {
      const size = Math.floor(Math.min(entries[0].contentRect.width, entries[0].contentRect.height) * 0.9);
      setCropSize(size);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [imageSrc]);

  const onCropComplete = useCallback((_: Area, pixels: Area) => setCroppedAreaPixels(pixels), []);

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
    setImageSrc(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!croppedAreaPixels || !imageSrc) {
      return;
    }
    setIsSaving(true);
    try {
      const blob = await getCroppedImage(imageSrc, croppedAreaPixels);
      const response = await uploadAvatar(blob);
      const url = response.profile.avatar_url || null;
      URL.revokeObjectURL(imageSrc);
      setAvatarUrl(url);
      onAvatarChange(url);
      toast.success("Avatar updated");
      hideModal();
    } catch (err) {
      toast.error(err instanceof ApiError ? "Failed to upload avatar" : "Network error. Please try again.");
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (imageSrc) {
      URL.revokeObjectURL(imageSrc);
    }
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setCropSize(null);
  };

  if (imageSrc) {
    return (
      <div className={styles.cropContent}>
        <h4 className={styles.title}>Adjust Photo</h4>
        <p className={styles.subtitle}>Zoom and position your photo.</p>
        <div ref={containerRef} className={styles.cropContainer}>
          {cropSize && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              cropSize={{ width: cropSize, height: cropSize }}
              objectFit="contain"
              restrictPosition={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>
        <div className={styles.zoomControl}>
          <ZoomOutIcon className={styles.zoomIcon} width={20} height={20} />
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className={styles.zoomSlider}
          />
          <ZoomInIcon className={styles.zoomIcon} width={20} height={20} />
        </div>
        <div className={styles.buttons}>
          <button
            type="button"
            onClick={handleBack}
            disabled={isSaving}
            className="ui-btn ui-btn-tertiary ui-btn-small flex-1"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="ui-btn ui-btn-primary ui-btn-small flex-1"
          >
            {isSaving ? <LoadingSpinner size="sm" /> : "Save"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <h4 className={styles.title}>Change Profile Photo</h4>
      <p className={styles.subtitle}>
        Upload a new profile image.
        <br />
        This will only be visible to you.
      </p>

      <button type="button" className={styles.uploadArea} onClick={() => fileInputRef.current?.click()}>
        <UploadIcon className={styles.uploadIcon} />
        <div className={styles.uploadText}>Click to upload a new photo</div>
        <div className={styles.uploadHint}>JPG, PNG or GIF. Max 5MB.</div>
      </button>

      <div className={styles.buttons}>
        <button type="button" onClick={hideModal} className="ui-btn ui-btn-default ui-btn-tertiary">
          Cancel
        </button>
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
