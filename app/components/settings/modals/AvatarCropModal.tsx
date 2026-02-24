"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { hideModal } from "@/lib/modal/store";
import { getCroppedImage } from "@/lib/utils/cropImage";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import styles from "./AvatarCropModal.module.css";

interface AvatarCropModalProps {
  imageSrc: string;
  onCrop: (blob: Blob) => void;
}

export function AvatarCropModal({ imageSrc, onCrop }: AvatarCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [cropSize, setCropSize] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const observer = new ResizeObserver((entries) => {
      const size = Math.floor(Math.min(entries[0].contentRect.width, entries[0].contentRect.height) * 0.9);
      setCropSize(size);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const onCropComplete = useCallback((_: Area, pixels: Area) => setCroppedAreaPixels(pixels), []);

  const handleSave = async () => {
    if (!croppedAreaPixels) {
      return;
    }
    setIsSaving(true);
    try {
      const blob = await getCroppedImage(imageSrc, croppedAreaPixels);
      onCrop(blob);
      hideModal();
    } catch {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Crop Avatar</h2>
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
        <span className={styles.zoomLabel}>Zoom</span>
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className={styles.zoomSlider}
        />
      </div>
      <div className={styles.buttons}>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="ui-btn ui-btn-primary ui-btn-small flex-1"
        >
          {isSaving ? <LoadingSpinner size="sm" /> : "Save"}
        </button>
        <button
          type="button"
          onClick={hideModal}
          disabled={isSaving}
          className="ui-btn ui-btn-secondary ui-btn-small flex-1"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
